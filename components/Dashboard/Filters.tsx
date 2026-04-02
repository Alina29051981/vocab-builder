"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./Filters.module.css";
import { Category, CATEGORIES } from "../../types/word";
import SortDropdown from "../SortDropdown/SortDropdown";

interface Props {
  onChange?: (params: {
    keyword: string;
    category: Category | "";
    isIrregular: boolean | null;
  }) => void;
  className?: string;
}

export default function Filters({ onChange, className }: Props) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [isIrregular, setIsIrregular] = useState<boolean | null>(null);

  const [debouncedKeyword] = useDebounce(keyword, 300);

  useEffect(() => {
    if (onChange) {
      onChange({
        keyword: debouncedKeyword.trim(),
        category,
        isIrregular,
      });
    }
  }, [debouncedKeyword, category, isIrregular, onChange]);

  const categoryOptions = [
    { value: "", label: "Categories" },
    ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
  ];

  const toggleVerbType = (value: boolean) => {
    setIsIrregular(value);
  };

  return (
    <div className={`${css.filters} ${className || ""}`}>
      <div className={css.searchWrapper}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Find the word"
          className={css.input}
        />
        <svg className={css.searchIcon} width="24" height="24" viewBox="0 0 20 20" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#121417" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#121417" strokeWidth="2" />
        </svg>
      </div>

      <SortDropdown
        value={category}
        onChange={(value) => {
          const newCategory = value as Category | "";
          setCategory(newCategory);
          if (newCategory !== "verb") {
            setIsIrregular(null);
          }
        }}
        options={categoryOptions}
      />

      {category === "verb" && (
        <div className={css.radioGroup}>
          {[
            { label: "Regular", value: false },
            { label: "Irregular", value: true },
          ].map((opt) => (
            <div
              key={String(opt.value)}
              className={`${css.radioCustom} ${
                isIrregular === opt.value ? css.active : ""
              }`}
              onClick={() => toggleVerbType(opt.value)}
            >
              <div className={css.radioCircle}>
                {isIrregular === opt.value && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="1" width="16" height="16" rx="8" stroke="#85AA9F" strokeWidth="2" />
                    <rect x="4" y="4" width="10" height="10" rx="5" fill="#85AA9F" />
                  </svg>
                )}
              </div>
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}