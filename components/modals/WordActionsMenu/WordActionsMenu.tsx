// components/modals/WordActionsMenu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import type { Word } from "@/types/word";
import EditWordModal from "../EditWordModal/EditWordModal";
import css from "./WordActionsMenu.module.css";
import { deleteWord } from "../../../lib/api/words";

interface Props {
  word: Word;
  onDelete?: (id: string) => void;
}

export default function WordActionsMenu({ word, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    try {
      setOpen(false); 
      await deleteWord(word._id); 
      onDelete?.(word._id); 
      console.log("Word deleted:", word._id);
    } catch (error) {
      console.error("Failed to delete word", error);
      alert("Не вдалося видалити слово");
    }
  };

  return (
    <div className={css.menuWrapper} ref={menuRef}>
      <button className={css.menuButton} onClick={() => setOpen(!open)}>
        ...
      </button>

      {open && (
        <div className={css.menuDropdown}>
          <button
            onClick={() => {
              setEditOpen(true);
              setOpen(false);
            }}
          >
            <svg className={css.icon} width="16" height="16">
  <use href="#icon-edit" />
</svg>

            Edit
          </button>

          <button onClick={handleDelete}> <svg className={css.icon} width="16" height="16">
        <use href="#icon-delete" />
      </svg>Delete</button>
        </div>
      )}

      {editOpen && (
        <EditWordModal
          word={word}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
}