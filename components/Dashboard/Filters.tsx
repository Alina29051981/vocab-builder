// components/Dashboard/Filters.tsx
"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./Filters.module.css";
import { Category, CATEGORIES } from "../../types/word";
import SortDropdown from "../SortDropdown/SortDropdown"; 

interface Props {
  onChange: (filters: {
    keyword: string;
    category: Category | "";
    isIrregular?: boolean | null;
  }) => void;
   className?: string;
}

export default function Filters({ onChange }: Props) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [isIrregular, setIsIrregular] = useState<boolean | null>(null);

  const [debouncedKeyword] = useDebounce(keyword, 300);

  useEffect(() => {
    onChange({
      keyword: debouncedKeyword.trim(),
      category,
      isIrregular: category === "verb" ? isIrregular : undefined,
    });
  }, [debouncedKeyword, category, isIrregular, onChange]);

    const categoryOptions = [
    { value: "", label: "Categories" },
    ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
  ];

  return (
    <div className={css.filters}>
      
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
        onChange={(value) => {
          setCategory(value as Category | "");
          setIsIrregular(null); 
        }}
        options={categoryOptions}
      />

{category === "verb" && (
  <div className={css.radioGroup}>
  
    <label className={css.radioLabel}>
      <input
        type="radio"
        name="irregular"
        checked={isIrregular === false}
        onChange={() => setIsIrregular(false)}
        className={css.radioInput}
      />

      <span className={css.customRadio}>
        <svg className={css.icon}>
          <use href="/sprite.svg#icon-check" />
        </svg>
      </span>
<span className={css.radioText}>
      Regular</span>
    </label>

    
    <label className={css.radioLabel}>
      <input
        type="radio"
        name="irregular"
        checked={isIrregular === true}
        onChange={() => setIsIrregular(true)}
        className={css.radioInput}
      />

      <span className={css.customRadio}>
        <svg className={css.icon}>
          <use href="/sprite.svg#icon-check" />
        </svg>
      </span>
<span className={css.radioText}>
      Irregular</span>
    </label>
  </div>
)}
    </div>
  );
}