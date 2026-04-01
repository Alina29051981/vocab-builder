"use client";

import { useEffect } from "react";
import css from "./WellDoneModal.module.css";
import type { Word } from "@/types/word";
import Image from "next/image";

interface Answer {
  word: Word;
  isCorrect: boolean;
}

interface Props {
  answers: Answer[]; 
  onClose: () => void;
}

export default function WellDoneModal({ answers = [], onClose }: Props) {
  
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [onClose]);

  const correctAnswers = answers.filter(a => a.isCorrect);
  const incorrectAnswers = answers.filter(a => !a.isCorrect);
  const total = answers.length;
  const correctCount = correctAnswers.length;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}> <button className={css.closeBtn} onClick={onClose} aria-label="Close menu">
          <svg viewBox="0 0 24 24">
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        
        <h2 className={css.title}>Well done</h2>

        <p className={css.summary}>
          You answered <strong>{correctCount}</strong> of <strong>{total}</strong> words
        </p>

        <p className={css.percent}>{percent}%</p>

        <div className={css.answerColumns}>
          <div className={css.correctColumn}>
            <h3 className={css.correctColumnTitle}>Сorrect answers: </h3>
            <ul className={css.correctColumnList}>
              {correctAnswers.map((a, index) => (
                <li key={`${a.word._id}-c-${index}`} className={css.correctColumnListItem}>
                  {a.word.en} → {a.word.ua}
                </li>
              ))}
            </ul>
          </div>

          <div className={css.incorrectColumn}>
            <h3 className={css.incorrectColumnTitle}>Mistakes:</h3>
            <ul className={css.incorrectColumnList}>
              {incorrectAnswers.map((a, index) => (
                <li key={`${a.word._id}-i-${index}`} className={css.incorrectColumnListItem}>
                  {a.word.en} → {a.word.ua}
                </li>
              ))}
            </ul>
         

           <div className={css.imageWellDone}>
        <Image
          src="/images/open orange book floating.webp"
          alt="Well done modal illustration"
          className={css.image}
          width={152}
          height={121}
          priority
        />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}