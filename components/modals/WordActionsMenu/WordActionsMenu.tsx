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
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

   useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setEditOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        <div className={`${css.menuDropdown} ${openUpward ? css.upward : ""}`}>
         
          <button
            onClick={() => {
              setEditOpen(true);
              setOpen(false);
            }}
          >
            <svg
              className={css.icon}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M11.334 1.99998C11.5091 1.82488 11.7169 1.68599 11.9457 1.59123C12.1745 1.49647 12.4197 1.44769 12.6673 1.44769C12.9149 1.44769 13.1601 1.49647 13.3889 1.59123C13.6177 1.68599 13.8256 1.82488 14.0007 1.99998C14.1757 2.17507 14.3146 2.38294 14.4094 2.61172C14.5042 2.84049 14.5529 3.08569 14.5529 3.33331C14.5529 3.58093 14.5042 3.82613 14.4094 4.05491C14.3146 4.28368 14.1757 4.49155 14.0007 4.66664L5.00065 13.6666L1.33398 14.6666L2.33398 11L11.334 1.99998Z"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit
          </button>

                   <button onClick={handleDelete}>
            <svg
              className={css.icon}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M2 4H3.33333H14"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.6673 3.99998V13.3333C12.6673 13.6869 12.5268 14.0261 12.2768 14.2761C12.0267 14.5262 11.6876 14.6666 11.334 14.6666H4.66732C4.3137 14.6666 3.97456 14.5262 3.72451 14.2761C3.47446 14.0261 3.33398 13.6869 3.33398 13.3333V3.99998M5.33398 3.99998V2.66665C5.33398 2.31302 5.47446 1.97389 5.72451 1.72384C5.97456 1.47379 6.3137 1.33331 6.66732 1.33331H9.33398C9.68761 1.33331 10.0267 1.47379 10.2768 1.72384C10.5268 1.97389 10.6673 2.31302 10.6673 2.66665V3.99998"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.66602 7.33331V11.3333"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.33398 7.33331V11.3333"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Delete
          </button>
        </div>
      )}

      {editOpen && <EditWordModal word={word} onClose={() => setEditOpen(false)} />}
    </div>
  );
}