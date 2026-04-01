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
        <svg className={css.searchIcon} width="24" height="24">
          <use href="/sprite.svg#icon-search" />
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
              className={`${css.radioCustom} ${isIrregular === opt.value ? css.active : ""}`}
              onClick={() => toggleVerbType(opt.value)}
            >
              <div className={css.radioCircle}>
                {isIrregular === opt.value && (
                  <svg width="18" height="18" >
                    <use href="/sprite.svg#dropdown" />
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