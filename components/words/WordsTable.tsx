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
  onEdit?: (word: Word) => void;
  onDelete?: (id: string) => void;
  showArrow?: boolean;
  initialAddedWordIds?: Set<string>;
  onAddWord?: (wordId: string) => Promise<void>;
}

function WordsTable({
  data,
  loading = false,
  variant = "dictionary",
  onEdit,
  showArrow,
  initialAddedWordIds,
  onAddWord,
}: Props) {
  const [addedWordIds, setAddedWordIds] = useState<Set<string>>(new Set());
  const [localWords, setLocalWords] = useState<Word[]>(data);

  useEffect(() => {
    if (initialAddedWordIds) {
      setAddedWordIds(new Set(initialAddedWordIds));
    }
  }, [initialAddedWordIds]);

  useEffect(() => {
    setLocalWords(data);
  }, [data]);

  if (loading) return <p className={css.state}>Loading...</p>;
  if (!localWords || localWords.length === 0) return <p className={css.state}>No words found.</p>;

  const handleAdd = async (id: string) => {
    if (addedWordIds.has(id) || !onAddWord) return;

    setAddedWordIds((prev) => new Set(prev).add(id));

    try {
      await onAddWord(id);
    } catch {
      setAddedWordIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDelete = (id: string) => {
    setLocalWords((prev) => prev.filter((word) => word._id !== id));
  };

  return (
    <div className={css.tableWrapper}>
      <table className={css.table}>
        <thead>
          <tr>
            <th className={css.flagHeader}>
              Word
              <svg className={css.flagIcon} width="20" height="20" viewBox="0 0 28 28">
                <use xlinkHref="#flag-england" />
                <defs>
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
                </defs>
              </svg>
            </th>
            <th className={css.flagHeader}>
              Translation
              <svg className={css.flagIcon} width="20" height="20" viewBox="0 0 28 28">
                <use xlinkHref="#flag-ukraine" />
                <defs>
                  <symbol id="flag-ukraine" viewBox="0 0 28 28">
                    <circle cx="14" cy="14" r="14" fill="#FFDA44" />
                    <path d="M0 14C0 6.26806 6.26806 0 14 0C21.7319 0 28 6.26806 28 14H0Z" fill="#338AF3" />
                  </symbol>
                </defs>
              </svg>
            </th>
            <th className={css.categoryHeader}>Category</th>
            {variant === "dictionary" && <th>Progress</th>}
            <th></th>
          </tr>
        </thead>

        <tbody>
          {localWords.map((word) => {
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
                    <WordActionsMenu
                      word={word}
                      onDelete={handleDelete}
                      onEdit={onEdit}
                    />
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