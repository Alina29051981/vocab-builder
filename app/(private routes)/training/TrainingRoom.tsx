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
  const [hint, setHint] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showWellDone, setShowWellDone] = useState(false);

  // 🔹 Завантаження слів
  const { data, isLoading, isError } = useQuery<PaginatedWordsResponse>({
    queryKey: ["ownWords"],
    queryFn: () => getOwnWords({ page: 1, limit: 25 }),
  });

  // 🔹 Вибір наступного слова
  const nextWord = useCallback(() => {
    if (!data?.results) return;

    const remaining = data.results.filter(w => !w.progress || w.progress < 100);
    if (remaining.length === 0) {
      setCurrentWord(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * remaining.length);
    setCurrentWord(remaining[randomIndex]);
    setUserAnswer("");
    setShowTranslation(false);
    setHint(null);
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

      // 🔹 Показ підказки
      if (isCorrect) {
        toast.success("Correct!");
        setHint(null);
      } else {
        setHint(currentWord?.ua || "");
        toast.error("Incorrect!");
      }

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
      if (currentWord) setAnswers(prev => [...prev, { word: currentWord, isCorrect }]);

      setShowTranslation(true);

      // 🔹 Перевірка завершення сесії
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
    setHint(null);
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
      <div className={css.progressWrapper}>
        <ProgressBar percent={percent} variant="training" />
      </div>

      {/* 🔹 Підкладка */}
      <div className={css.bock}></div>

      <div className={css.cardsWrapper}>
        {/* UA */}
        <div className={css.card}>
          <div className={css.cardTopRow}>
            <input
              type="text"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="Введіть переклад"
              className={css.input}
              disabled={showTranslation}
            />

            {/* 🔹 Підказка праворуч від інпуту */}
            {hint && <div className={css.hint}>{hint}</div>}

            <div className={css.langDesktop}>
              <svg className={css.flagIcon}>
                <use href="#flag-ukraine" />
              </svg>
              <span>Ukrainian</span>
            </div>
          </div>

          <div className={css.cardFooter}>
            <button
              className={css.nextButton}
              onClick={nextWord}
              disabled={!userAnswer.trim() || !showTranslation}
            >
              Next<span className={css.nextArrow}>→</span>
            </button>

            <div className={css.langMobile}>
              <svg className={css.flagIcon}>
                <use href="#flag-ukraine" />
              </svg>
              <span>Ukrainian</span>
            </div>
          </div>
        </div>

        {/* EN */}
        <div className={css.card}>
          <div className={css.cardTopRow}>
            <p className={css.word}>{currentWord.en}</p>

            <div className={css.langDesktop}>
              <svg className={css.flagIcon}>
                <use href="#flag-england" />
              </svg>
              <span>English</span>
            </div>
          </div>

          <div className={css.cardFooterRight}>
            <div className={css.langMobile}>
              <svg className={css.flagIcon}>
                <use href="#flag-england" />
              </svg>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {showTranslation && <p className={css.translation}>Correct: {currentWord.ua}</p>}

      <div className={css.actionsUnderCards}>
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
      </div>

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