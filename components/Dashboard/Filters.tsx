// components/Dashboard/Filters.tsx
"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./Filters.module.css";
import { Category, CATEGORIES } from "../../types/word";
import SortDropdown from "../SortDropdown/SortDropdown";

interface Props {
  onChange?: (params: { keyword: string; category: Category | ""; isIrregular: boolean | null }) => void;
  className?: string;
}

export default function Filters({ onChange, className }: Props) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [isIrregular] = useState<boolean | null>(null);

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

      <SortDropdown
        value={category}
        onChange={(value) => setCategory(value as Category | "")}
        options={categoryOptions}
      />
    </div>
  );
}