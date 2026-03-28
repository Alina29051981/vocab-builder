// components/words/WordPagination.tsx
"use client";

import { memo, useState, useEffect } from "react";
import css from "./Pagination.module.css";

interface WordsPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function WordsPagination({ page, totalPages, onChange }: WordsPaginationProps) {
  const [maxVisible, setMaxVisible] = useState(3); 

   useEffect(() => {
    const updateMax = () => {
      if (window.innerWidth >= 1024) setMaxVisible(5);
      else setMaxVisible(3);
    };
    updateMax();
    window.addEventListener("resize", updateMax);
    return () => window.removeEventListener("resize", updateMax);
  }, []);

  if (totalPages <= 1) return null;

  const handlePrev = () => page > 1 && onChange(page - 1);
  const handleNext = () => page < totalPages && onChange(page + 1);

  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
     
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

      pages.push(1);

    let start = page - 1;
    let end = page + 1;

    if (page === 1) {
      start = 2;
      end = 3;
    } else if (page === totalPages) {
      start = totalPages - 2;
      end = totalPages - 1;
    } else if (page === 2) {
      start = 2;
      end = 3;
    } else if (page === totalPages - 1) {
      start = totalPages - 2;
      end = totalPages - 1;
    }

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");

       pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className={css.pagination}>
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={page === 1}
        className={css.button}
        aria-label="First page"
      >
        {"<<"}
      </button>
      <button
        type="button"
        onClick={handlePrev}
        disabled={page === 1}
        className={css.button}
        aria-label="Previous page"
      >
        {"<"}
      </button>

      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={idx}
            onClick={() => onChange(p)}
            className={`${css.page} ${p === page ? css.active : ""}`}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className={css.dots}>
            {p}
          </span>
        )
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={page === totalPages}
        className={css.button}
        aria-label="Next page"
      >
        {">"}
      </button>
      <button
        type="button"
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
        className={css.button}
        aria-label="Last page"
      >
        {">>"}
      </button>
    </div>
  );
}

export default memo(WordsPagination);