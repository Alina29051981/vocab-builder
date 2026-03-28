"use client";

import { memo, useState } from "react";
import { AxiosError } from "axios";
import css from "./WordsTable.module.css";
import type { Word } from "@/types/word";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import WordActionsMenu from "../modals/WordActionsMenu/WordActionsMenu";
import { addWordFromOtherUser } from "@/lib/api/words";

interface Props {
  data: Word[];
  loading?: boolean;
  variant?: "dictionary" | "recommend";
  onDelete?: (id: string) => void;
  onEdit?: (word: Word) => void;
  showArrow?: boolean;
}

function WordsTable({
  data,
  loading = false,
  variant = "dictionary",
  onDelete,
  showArrow,
}: Props) {
 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (loading) return <p className={css.state}>Loading...</p>;
  if (!data || data.length === 0)
    return <p className={css.state}>No words found.</p>;

  const handleAdd = async (id: string) => {
    try {
      setErrorMessage(null);
      await addWordFromOtherUser(id);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 409) {
        setErrorMessage("This word is already in your dictionary");
      } else {
        setErrorMessage("Error adding word");
      }
    }
  };

  return (
    <div className={css.tableWrapper}>
     
      {errorMessage && <p className={css.error}>{errorMessage}</p>}

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
                  <ProgressBar current={word.progress ?? 0} total={100} />
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
                  >
                    →
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