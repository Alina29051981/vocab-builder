// WordsTable.tsx
"use client";

import { memo } from "react";
import { AxiosError } from "axios";
import css from "./WordsTable.module.css";
import type { Word } from "@/types/word";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import WordActionsMenu from "../modals/WordActionsMenu/WordActionsMenu";
import toast from "react-hot-toast";

interface Props {
  data: Word[];
  loading?: boolean;
  variant?: "dictionary" | "recommend";
  onDelete?: (id: string) => void;
  onEdit?: (word: Word) => void;
  showArrow?: boolean;
  addedWordIds?: Set<string>;
  onAddWord?: (wordId: string) => Promise<void>;
}

function WordsTable({
  data,
  loading = false,
  variant = "dictionary",
  onDelete,
  showArrow,
  addedWordIds,
  onAddWord,
}: Props) {
  if (loading) return <p className={css.state}>Loading...</p>;
  if (!data || data.length === 0)
    return <p className={css.state}>No words found.</p>;

  const handleAdd = async (id: string) => {
    if (!onAddWord) return;

    try {
      await onAddWord(id);
      toast.success("Word added");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 409) {
        toast("This word is already in your dictionary");
      } else {
        toast.error("Failed to add word");
      }
    }
  };

  return (
    <div className={css.tableWrapper}>
      <table className={css.table}>
        <thead>
          <tr>
            <th>Word</th>
            <th>Translation</th>
            <th className={css.categoryHeader}>Category</th>
            {variant === "dictionary" && <th>Progress</th>}
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.map((word) => (
            <tr key={word._id} className={css.row}>
              <td className={css.clickableCell}>{word.en}</td>
              <td className={css.clickableCell}>{word.ua}</td>
              <td className={`${css.category} ${css.categoryCell}`}>
                {word.category}
              </td>

              {variant === "dictionary" && (
                <td className={css.progressCell}>
                  <ProgressBar percent={word.progress ?? 0} />
                </td>
              )}

              <td className={css.actions}>
                {variant === "dictionary" && (
                  <WordActionsMenu word={word} onDelete={onDelete} />
                )}

              {variant === "recommend" && showArrow && (
  <button
    className={css.arrowLink}
    onClick={() => handleAdd(word._id)}
    disabled={addedWordIds?.has(word._id)}
  >
    {addedWordIds?.has(word._id) ? (
      <>
        <span className={css.addText}>Added to dictionary</span>
        <span className={css.tick}>✔</span>
      </>
    ) : (
      <>
        <span className={css.addText}>Add to dictionary</span>
        <span className={css.arrow}>→</span>
      </>
    )}
  </button>
)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(WordsTable);