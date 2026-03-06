"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./Filters.module.css";

interface Props {
  onKeywordChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onVerbTypeChange?: (value: string) => void;
}

export default function Filters({
  onKeywordChange,
  onCategoryChange,
  onVerbTypeChange,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [verbType, setVerbType] = useState("");

  // Debounce без trim
  const [debouncedKeyword] = useDebounce(keyword, 300);

  // Передаємо keyword (trim робимо тут)
  useEffect(() => {
    onKeywordChange(debouncedKeyword.trim());
  }, [debouncedKeyword, onKeywordChange]);

  // Передаємо category
  useEffect(() => {
    onCategoryChange(category);

    // якщо категорія не verb — скидаємо verbType
    if (category !== "verb") {
      setVerbType("");
      onVerbTypeChange?.("");
    }
  }, [category, onCategoryChange, onVerbTypeChange]);

  // Передаємо verbType
  useEffect(() => {
    if (category === "verb") {
      onVerbTypeChange?.(verbType);
    }
  }, [verbType, category, onVerbTypeChange]);

  return (
    <div className={css.filters}>
      {/* SEARCH */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search word..."
        className={css.input}
      />

      {/* CATEGORY */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={css.select}
      >
        <option value="">All categories</option>
        <option value="noun">Noun</option>
        <option value="verb">Verb</option>
        <option value="adjective">Adjective</option>
      </select>

      {/* VERB TYPE (тільки якщо verb) */}
      {category === "verb" && (
        <div className={css.radioGroup}>
          <label>
            <input
              type="radio"
              value="regular"
              checked={verbType === "regular"}
              onChange={(e) => setVerbType(e.target.value)}
            />
            Regular
          </label>

          <label>
            <input
              type="radio"
              value="irregular"
              checked={verbType === "irregular"}
              onChange={(e) => setVerbType(e.target.value)}
            />
            Irregular
          </label>
        </div>
      )}
    </div>
  );
}