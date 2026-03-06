"use client";

import { memo } from "react";
import css from "./WordsPagination.module.css";

interface WordsPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function WordsPagination({
  page,
  totalPages,
  onChange,
}: WordsPaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) {
      onChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onChange(page + 1);
    }
  };

  return (
    <div className={css.pagination}>
      <button
        type="button"
        onClick={handlePrev}
        disabled={page === 1}
        className={css.button}
        aria-label="Previous page"
      >
        Prev
      </button>

      <span className={css.info}>
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={handleNext}
        disabled={page === totalPages}
        className={css.button}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}

export default memo(WordsPagination);