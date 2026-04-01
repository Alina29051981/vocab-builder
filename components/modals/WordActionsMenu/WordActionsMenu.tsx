"use client";

import { useState, useRef, useEffect } from "react";
import type { Word } from "@/types/word";
import EditWordModal from "../EditWordModal/EditWordModal";
import css from "./WordActionsMenu.module.css";
import { deleteWord } from "../../../lib/api/words";

interface Props {
  word: Word;
  onDelete?: (id: string) => void;
  onEdit?: (word: Word) => void; 
}

export default function WordActionsMenu({ word, onDelete }: Props) {
  
  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);       
      setEditOpen(false);  
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, []);
  
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 80;
      setOpenUpward(spaceBelow < dropdownHeight);
    }
  }, [open]);

  const handleDelete = async () => {
    try {
      setOpen(false);
      await deleteWord(word._id);
      onDelete?.(word._id);
    } catch (error) {
      alert("Не вдалося видалити слово");
      console.error(error);
    }
  };

  return (
    <div className={css.menuWrapper} ref={menuRef}>
      <button
        ref={buttonRef}
        className={css.menuButton}
        onClick={() => setOpen(!open)}
      >
        ...
      </button>

      {open && (
        <div
          className={`${css.menuDropdown} ${
            openUpward ? css.upward : ""
          }`}
        >
          <button
            onClick={() => {
              setEditOpen(true);
              setOpen(false);
            }}
          >
            <svg className={css.icon} width="32" height="32">
              <use href="/sprite.svg#icon-edit" />
            </svg>
            Edit
          </button>

          <button onClick={handleDelete}>
            <svg className={css.icon} width="16" height="16">
              <use href="/sprite.svg#icon-delete" />
            </svg>
            Delete
          </button>
        </div>
      )}

      {editOpen && <EditWordModal word={word} onClose={() => setEditOpen(false)} />}
    </div>
  );
}