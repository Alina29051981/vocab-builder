"use client";

import { memo } from "react";
import css from "./WordsTable.module.css";
import type { Word } from "@/types/word";

interface Props {
  data: Word[];
  loading?: boolean;
  onEdit?: (word: Word) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

function WordsTable({
  data,
  loading = false,
  onEdit,
  onDelete,
  showActions = true,
}: Props) {
  if (loading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <p>No words found.</p>;

  return (
    <table className={css.table}>
      <thead>
        <tr>
          <th>English</th>
          <th>Ukrainian</th>
          <th>Category</th>
          <th>Progress</th>
          {showActions && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {data.map((word) => (
          <tr key={word._id}>
            <td>{word.en}</td>
            <td>{word.ua}</td>
            <td>{word.category}</td>
            <td>{word.progress ?? 0}%</td>

            {showActions && (
              <td className={css.actions}>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(word)}
                  >
                    Edit
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(word._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default memo(WordsTable);