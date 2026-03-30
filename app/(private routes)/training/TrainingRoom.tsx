"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getOwnWords } from "@/lib/api/words";
import { postTrainingAnswers } from "@/lib/api/training";
import { Word, PaginatedWordsResponse } from "@/types/word";
import ProgressBar from "../../../components/ProgressBar/ProgressBar";
import WellDoneModal from "../../../components/modals/WellDoneModal";
import css from "./TrainingRoom.module.css";

type Answer = { word: Word; isCorrect: boolean };

export default function TrainingRoom() {
  const queryClient = useQueryClient();

  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showWellDone, setShowWellDone] = useState(false);

  // 🔹 Завантаження слів (limit 25!)
  const { data, isLoading, isError } = useQuery<PaginatedWordsResponse>({
    queryKey: ["ownWords"],
    queryFn: () => getOwnWords({ page: 1, limit: 25 }),
  });

  // 🔹 Вибір слова (тільки progress < 100)
  const nextWord = useCallback(() => {
    if (!data?.results || data.results.length === 0) return;

    const remaining = data.results.filter(w => !w.progress || w.progress < 100);
    if (remaining.length === 0) {
      setCurrentWord(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * remaining.length);
    setCurrentWord(remaining[randomIndex]);
    setUserAnswer("");
    setShowTranslation(false);
  }, [data]);

  useEffect(() => {
    if (data?.results) nextWord();
  }, [data, nextWord]);

  // 🔹 Відправка відповіді
  const submitAnswer = useMutation({
    mutationFn: (word: Word) =>
      postTrainingAnswers([
        {
          _id: word._id,
          en: word.en,
          ua: userAnswer,
          task: "en",
        },
      ]),
    onSuccess: res => {
      const result = res[0];
      const isCorrect = !!result.isDone;

      if (isCorrect) toast.success("Correct!");
      else toast.error("Incorrect!");

      // 🔹 Оновлення локального прогресу
      if (currentWord && data?.results) {
        const updatedResults = data.results.map(w =>
          w._id !== currentWord._id
            ? w
            : { ...w, progress: isCorrect ? Math.min((w.progress ?? 0) + 10, 100) : (w.progress ?? 0) }
        );
        queryClient.setQueryData(["ownWords"], { ...data, results: updatedResults });
      }

      // 🔹 Додаємо до списку відповідей
      if (currentWord) {
        setAnswers(prev => [...prev, { word: currentWord, isCorrect }]);
      }

      setShowTranslation(true);

      // 🔹 Перевірка завершення сесії або 25 слів
      if (answers.length + 1 >= Math.min(25, data?.results.length ?? 25)) {
        setShowWellDone(true);
      }
    },
    onError: () => toast.error("Failed to check answer"),
  });

  // 🔹 Save
  const handleSave = () => {
    if (!currentWord || !userAnswer.trim()) return;
    submitAnswer.mutate(currentWord);
  };

  // 🔹 Cancel
  const handleCancel = () => {
    setUserAnswer("");
    setShowTranslation(false);
  };

  // 🔹 Плавний прогрес
  const percent =
    data?.results && data.results.length > 0
      ? Math.round(data.results.reduce((acc, w) => acc + (w.progress ?? 0), 0) / data.results.length)
      : 0;

  // 🔹 Loader / Error
  if (isLoading) return <p className={css.info}>Loading words...</p>;
  if (isError) return <p className={css.error}>Failed to load words</p>;
  if (!currentWord) return <p className={css.info}>All words learned! 🎉</p>;

  return (
    <div className={css.wrapper}>
      <ProgressBar percent={percent} className={css.progressBar} />

      <div className={css.cardsWrapper}>
        {/* UA Card */}
        <div className={css.cardUa}>
          <input
            type="text"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Введіть переклад"
            className={css.input}
            disabled={showTranslation}
          />

          <div className={css.next}>
            <button
              className={css.nextButton}
              onClick={nextWord}
              disabled={!userAnswer.trim() || !showTranslation}
            >
              Next<span className={css.nextArrow}>→</span>
            </button>
            <p className={css.flag}>Ukrainian</p>
          </div>
        </div>

        {/* EN Card */}
        <div className={css.cardEn}>
          <p className={css.word}>{currentWord.en}</p>
          <p className={css.flag}>English</p>
        </div>
      </div>

      {/* Показ перекладу */}
      {showTranslation && <p className={css.translation}>Correct: {currentWord.ua}</p>}

      <button
        className={css.saveButton}
        onClick={handleSave}
        disabled={!userAnswer.trim() || showTranslation}
      >
        Save
      </button>

      <button
        className={css.cancelButton}
        onClick={handleCancel}
        disabled={showTranslation}
      >
        Cancel
      </button>

      {/* WellDoneModal */}
      {showWellDone && (
        <WellDoneModal
          answers={answers}
          onClose={() => {
            setShowWellDone(false);
            setAnswers([]);
            nextWord();
          }}
        />
      )}
    </div>
  );
}