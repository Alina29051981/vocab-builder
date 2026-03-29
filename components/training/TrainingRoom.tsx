// components/training/TrainingRoom.tsx
"use client";

import { useState, useMemo } from "react";
import type { TaskWord } from "@/types/training";
import css from "./TrainingRoom.module.css";
import WellDoneModal from "../modals/WellDoneModal";

interface TrainingRoomProps {
  words: TaskWord[];
  onSaveAnswer: (wordId: string, uaAnswer: string) => void;
  onFinish: () => void; 
}

export default function TrainingRoom({ words, onSaveAnswer, onFinish }: TrainingRoomProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const wordCount = words.length;
  const currentWord = words[currentIndex];

  const progressPercent = useMemo(() => Math.round((currentIndex / wordCount) * 100), [currentIndex, wordCount]);

  const nextWord = () => {
    setUserAnswer("");
    if (currentIndex < wordCount - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setFinished(true);
      onFinish(); 
    }
  };

  const handleSave = () => {
    if (!currentWord || !userAnswer.trim()) return;

    if (userAnswer.trim().toLowerCase() === currentWord.ua.toLowerCase()) setCorrect(prev => prev + 1);

    onSaveAnswer(currentWord._id, userAnswer.trim());
    nextWord();
  };

  if (!currentWord) return <p className={css.info}>No words for training</p>;

  return (
    <div className={css.wrapper}>
     
      <div className={css.progressCircle}>
        <svg width="100" height="100">
          <circle cx="50" cy="50" r="45" stroke="#e6e6e6" strokeWidth="10" fill="none" />
          <circle
            cx="50" cy="50" r="45"
            stroke="#4caf50" strokeWidth="10" fill="none"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progressPercent / 100)}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="55" textAnchor="middle" fontSize="18" fill="#333">{progressPercent}%</text>
        </svg>
      </div>

          <div className={css.card}>
       <p className={css.label}>
  {currentWord.task === "en"
    ? "Enter translation"
    : "Введіть переклад"}</p>
        <input
          className={css.input}
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          placeholder="Next →"
          disabled={finished}
        />
      </div>

          <div className={css.card}>
       <p className={css.word}>
  {currentWord.task === "en" ? currentWord.ua : currentWord.en}
</p>
      </div>

           <div className={css.actions}>
        <button className={css.saveBtn} onClick={handleSave} disabled={finished || !userAnswer.trim()}>Save</button>
        <button className={css.cancelBtn} onClick={nextWord} disabled={finished}>Cancel</button>
      </div>

         {finished && (
        <WellDoneModal
          total={wordCount}
          correct={correct}
          onClose={() => {
            setCurrentIndex(0);
            setUserAnswer("");
            setCorrect(0);
            setFinished(false);
          }}
        />
      )}
    </div>
  );
}