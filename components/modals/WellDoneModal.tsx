// components/modals/WellDoneModal.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import css from "./WellDoneModal.module.css";

interface Props {
  total: number;
  correct: number;
  onClose: () => void;
}

export default function WellDoneModal({ total, correct, onClose }: Props) {
  const percent = Math.round((correct / total) * 100);
  const router = useRouter();

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
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Well done </h2>

        <p>
          You answered <strong>{correct}</strong> of <strong>{total}</strong>{" "}
          words
        </p>

        <p className={css.percent}>{percent}%</p>

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