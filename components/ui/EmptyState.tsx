"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./EmptyState.module.css";

interface Props {
  onCancel: () => void;
}

export default function EmptyState({ onCancel }: Props) {
  const router = useRouter();

  const handleAddWordClick = () => {
    router.push("/dictionary?addWord=true");
  };

  return (
    <div className={css.wrapper}>
      <div className={css.imageWrapper}>
        <Image
          src="/image-blood-report.webp"
          alt="Empty state illustration"
          className={css.image}
          width={144}
          height={166}
          priority
        />
      </div>

      <h2 className={css.title}>
        You don&apos;t have a single word to learn right now.
      </h2>

      <p className={css.description}>
       Please create or add a word to start the workout. We want to improve your vocabulary and develop your knowledge, so please share the words you are interested in adding to your study.
      </p>

      <div className={css.buttons}>
        <button onClick={handleAddWordClick} className={css.addButton}>
          Add Word
        </button>

        <button onClick={onCancel} className={css.cancelButton}>
          Cancel
        </button>
      </div>
    </div>
  );
}