// components/SortDropdown/SortDropdown.tsx
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
}

export default function SortDropdown({
  value,
  onChange,
  options,
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    options.find((opt) => opt.value === value) || null;

  return (
    <div
      className={styles.wrapper}
      ref={dropdownRef}
    >
      <div
        className={styles.selected}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedOption?.label}

        <svg className={styles.arrow} width="20" height="20">
          <use href="/sprite.svg#icon-search" />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
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
