"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24">
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}