"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import css from "./WellDoneModal.module.css";
import type { Word } from "@/types/word";

interface Answer {
  word: Word;
  isCorrect: boolean;
}

interface Props {
  answers: Answer[]; 
  onClose: () => void;
}

export default function WellDoneModal({ answers, onClose }: Props) {
  const router = useRouter();

  const correctAnswers = answers.filter(a => a.isCorrect);
  const incorrectAnswers = answers.filter(a => !a.isCorrect);
  const total = answers.length;
  const correctCount = correctAnswers.length;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleStartAgain = () => {
    onClose();
    router.push("/dictionary");
  };

  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <h2 className={css.title}>Well done!</h2>

        <p className={css.summary}>
          You answered <strong>{correctCount}</strong> of <strong>{total}</strong> words
        </p>

        <p className={css.percent}>{percent}%</p>

        <div className={css.answerColumns}>
          <div className={css.correctColumn}>
            <h3 className={css.correctColumnTitle}>Correct</h3>
            <ul className={css.correctColumnList}>
              {correctAnswers.map((a, index) => (
                <li key={`${a.word._id}-c-${index}`} className={css.correctColumnListItem}>
                  {a.word.en} → {a.word.ua}
                </li>
              ))}
            </ul>
          </div>

          <div className={css.incorrectColumn}>
            <h3 className={css.incorrectColumnTitle}>Incorrect</h3>
            <ul className={css.incorrectColumnList}>
              {incorrectAnswers.map((a, index) => (
                <li key={`${a.word._id}-i-${index}`} className={css.incorrectColumnListItem}>
                  {a.word.en} → {a.word.ua}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={css.actions}>
          <button onClick={onClose} className={css.button}>
            Close
          </button>

          <button onClick={handleStartAgain} className={css.buttonSecondary}>
            Start again
          </button>
        </div>
      </div>
    </div>
  );
}