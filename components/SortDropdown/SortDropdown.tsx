"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./SortDropdown.module.css";

type Option = {
  value: string;
  label: string;
};

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  theme?: "dark" | "light"; 
}

export default function SortDropdown({
  value,
  onChange,
  options,
  theme = "dark",
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <div
      className={`${styles.wrapper} ${theme === "light" ? styles.light : ""}`}
      ref={dropdownRef}
    >
      <div
        className={styles.selected}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedOption?.label || "Select..."}

        <svg
          className={styles.arrow}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 10L10 15L15 10"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option, idx) => (
            <div
              key={`${option.value}-${idx}`}
              className={styles.option}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}