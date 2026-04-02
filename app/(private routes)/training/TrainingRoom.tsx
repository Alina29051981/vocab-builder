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
import { useRouter } from "next/navigation";


type Answer = { word: Word; isCorrect: boolean };

export default function TrainingRoom() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showWellDone, setShowWellDone] = useState(false);
  const ukrRegex = /^[А-Яа-яЇїІіЄєҐґ\s'-]+$/;
  const isValid = ukrRegex.test(userAnswer.trim());
  const { data, isLoading, isError } = useQuery<PaginatedWordsResponse>({
    queryKey: ["ownWords"],
    queryFn: () => getOwnWords({ page: 1, limit: 25 }),
  });

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

      if (isCorrect) {
        toast.success("Correct!");
        setHint(null);
      } else {
        setHint(currentWord?.ua || "");
        toast.error("Incorrect!");
      }

      if (currentWord && data?.results) {
        const updatedResults = data.results.map(w =>
          w._id !== currentWord._id
            ? w
            : { ...w, progress: isCorrect ? Math.min((w.progress ?? 0) + 10, 100) : (w.progress ?? 0) }
        );
        queryClient.setQueryData(["ownWords"], { ...data, results: updatedResults });
      }

      if (currentWord) setAnswers(prev => [...prev, { word: currentWord, isCorrect }]);
      setShowTranslation(true);

      if (answers.length + 1 >= Math.min(25, data?.results.length ?? 25)) {
        setShowWellDone(true);
      }
    },
    onError: () => toast.error("Failed to check answer"),
  });

  const handleSave = () => {
  if (!currentWord) return;

  const trimmed = userAnswer.trim();

  if (!trimmed) {
    toast.error("Введіть відповідь");
    return;
  }

  if (!ukrRegex.test(trimmed)) {
    toast.error("Тільки українські літери");
    return;
  }

  submitAnswer.mutate(currentWord);
};

  const handleCancel = () => {
    router.push("/dictionary");
  };

  const percent =
    data?.results && data.results.length > 0
      ? Math.round(data.results.reduce((acc, w) => acc + (w.progress ?? 0), 0) / data.results.length)
      : 0;

  if (isLoading) return <p className={css.info}>Loading words...</p>;
  if (isError) return <p className={css.error}>Failed to load words</p>;
  if (!currentWord) return <p className={css.info}>All words learned! 🎉</p>;

  return (
    <div className={css.wrapper}>
      <svg style={{ display: "none" }}>
        <symbol id="flag-ukraine" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="14" fill="#FFDA44" />
          <path d="M0 14C0 6.26806 6.26806 0 14 0C21.7319 0 28 6.26806 28 14H0Z" fill="#338AF3" />
        </symbol>
        <symbol id="flag-england" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="14" fill="#F0F0F0" />
          <path d="M2.8942 5.4765C1.79448 6.90729 0.965258 8.55639 0.482422 10.3479H7.76559L2.8942 5.4765Z" fill="#0052B4" />
          <path d="M27.5174 10.3479C27.0346 8.55645 26.2053 6.90735 25.1057 5.47656L20.2344 10.3479H27.5174Z" fill="#0052B4" />
          <path d="M0.482422 17.6523C0.965312 19.4437 1.79454 21.0928 2.8942 22.5236L7.76543 17.6523H0.482422Z" fill="#0052B4" />
          <path d="M22.5237 2.89413C21.0929 1.79442 19.4439 0.96519 17.6523 0.4823V7.76542L22.5237 2.89413Z" fill="#0052B4" />
          <path d="M5.47656 25.1059C6.90735 26.2056 8.55645 27.0349 10.3479 27.5177V20.2347L5.47656 25.1059Z" fill="#0052B4" />
          <path d="M10.3479 0.4823C8.5564 0.96519 6.9073 1.79442 5.47656 2.89407L10.3479 7.76536V0.4823Z" fill="#0052B4" />
          <path d="M17.6523 27.5177C19.4438 27.0349 21.0929 26.2056 22.5236 25.106L17.6523 20.2347V27.5177Z" fill="#0052B4" />
          <path d="M20.2344 17.6523L25.1057 22.5236C26.2053 21.0929 27.0346 19.4437 27.5174 17.6523H20.2344Z" fill="#0052B4" />
          <path d="M27.8815 12.1739H15.8262H15.8261V0.118508C15.2283 0.0406875 14.6189 0 14 0C13.381 0 12.7717 0.0406875 12.1739 0.118508V12.1738V12.1739H0.118508C0.0406875 12.7717 0 13.3811 0 14C0 14.619 0.0406875 15.2283 0.118508 15.8261H12.1738H12.1739V27.8815C12.7717 27.9593 13.381 28 14 28C14.6189 28 15.2283 27.9594 15.8261 27.8815V15.8262V15.8261H27.8815C27.9593 15.2283 28 14.619 28 14C28 13.3811 27.9593 12.7717 27.8815 12.1739V12.1739Z" fill="#D80027" />
        </symbol>
      </svg>

      <div className={css.progressWrapper}>
        <ProgressBar percent={percent} variant="training" />
      </div>

      <div className={css.cardsWrapper}>
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

           <div className={css.actionsUnderCards}>
       <button
  className={css.saveButton}
  onClick={handleSave}
  disabled={!userAnswer.trim() || showTranslation || !isValid}
>
  Save
</button>

        <button
          className={css.cancelButton}
          onClick={handleCancel}
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