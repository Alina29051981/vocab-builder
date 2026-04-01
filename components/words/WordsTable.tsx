"use client";

import { useState, useEffect, memo } from "react";
import css from "./WordsTable.module.css";
import type { Word } from "@/types/word";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import WordActionsMenu from "../modals/WordActionsMenu/WordActionsMenu";

interface Props {
  data: Word[];
  loading?: boolean;
  variant?: "dictionary" | "recommend";
  onDelete?: (id: string) => void;
  onEdit?: (word: Word) => void;
  showArrow?: boolean;
  initialAddedWordIds?: Set<string>;
  onAddWord?: (wordId: string) => Promise<void>;
}

function WordsTable({
  data,
  loading = false,
  variant = "dictionary",
  onDelete,
  onEdit,
  showArrow,
  initialAddedWordIds,
  onAddWord,
}: Props) {
  const [addedWordIds, setAddedWordIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialAddedWordIds) {
      setAddedWordIds(new Set(initialAddedWordIds));
    }
  }, [initialAddedWordIds]);

  if (loading) return <p className={css.state}>Loading...</p>;
  if (!data || data.length === 0) return <p className={css.state}>No words found.</p>;

    const handleAdd = async (id: string) => {
    if (addedWordIds.has(id) || !onAddWord) return;

    setAddedWordIds((prev) => new Set(prev).add(id)); 

    try {
      await onAddWord(id); 
    } catch  {
      
      setAddedWordIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

    }
  };

  return (
    <div className={css.tableWrapper}>
      <table className={css.table}>
        <thead>
          <tr>
            <th className={css.flagHeader}>
              Word
              <svg className={css.flagIcon} width="20" height="20">
                <use xlinkHref="#flag-england" />
              </svg>
            </th>
            <th className={css.flagHeader}>
              Translation
              <svg className={css.flagIcon} width="20" height="20">
                <use xlinkHref="#flag-ukraine" />
              </svg>
            </th>
            <th className={css.categoryHeader}>Category</th>
            {variant === "dictionary" && <th>Progress</th>}
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.map((word) => {
            const isAdded = addedWordIds.has(word._id);

            return (
              <tr key={word._id} className={css.row}>
                <td className={css.clickableCell}>{word.en}</td>
                <td className={css.clickableCell}>{word.ua}</td>
                <td className={`${css.category} ${css.categoryCell}`}>{word.category}</td>

                {variant === "dictionary" && (
                  <td className={css.progressCell}>
                    <ProgressBar percent={word.progress ?? 0} variant="table" />
                  </td>
                )}

                <td className={css.actions}>
                  {variant === "dictionary" && (
                    <WordActionsMenu word={word} onDelete={onDelete} onEdit={onEdit} />
                  )}

                  {variant === "recommend" && showArrow && (
                    <button
                      className={css.arrowLink}
                      onClick={() => handleAdd(word._id)}
                      disabled={isAdded}
                    >
                      {isAdded ? (
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
            );
          })}

          <tr className={css.emptyRow}>
            <td colSpan={variant === "dictionary" ? 5 : 4}>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default memo(WordsTable);