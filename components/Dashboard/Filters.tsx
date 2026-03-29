// components/Dashboard/Filters.tsx
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

  return (
    <div className={`${css.filters} ${className || ""}`}>
      {/* 🔍 Search */}
      <div className={css.searchWrapper}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Find the word"
          className={css.input}
        />
        <svg className={css.searchIcon} width="20" height="20">
          <use href="/sprite.svg#icon-search" />
        </svg>
      </div>

      {/* 📂 Category */}
      <SortDropdown
        value={category}
        onChange={(value) => {
          const newCategory = value as Category | "";
          setCategory(newCategory);

          // 🔥 скидаємо стан при зміні категорії
          if (newCategory !== "verb") {
            setIsIrregular(null);
          }
        }}
        options={categoryOptions}
      />

      {/* 🔥 Radios тільки для verb */}
      {category === "verb" && (
        <div className={css.radioGroup}>
          <label className={css.radioLabel}>
            <input
              type="radio"
              name="verbType"
              checked={isIrregular === false}
              onChange={() => setIsIrregular(false)}
            />
            Regular
          </label>

          <label className={css.radioLabel}>
            <input
              type="radio"
              name="verbType"
              checked={isIrregular === true}
              onChange={() => setIsIrregular(true)}
            />
            Irregular
          </label>
        </div>
      )}
    </div>
  );
}