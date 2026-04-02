"use client";

import css from "./WordFormFields.module.css";
import { CATEGORIES, Category } from "../../../types/word";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { FormValues } from "../../../lib/validation/createWordSchema";
import SortDropdown from "../../SortDropdown/SortDropdown";

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export default function WordFormFields({
  register,
  errors,
  watch,
  setValue,
}: Props) {
  const selectedCategory = watch("category");
  const isIrregularChecked = watch("isIrregular");

  const categoryOptions = [
    { value: "noun" as Category, label: "Categories" },
    ...CATEGORIES.map((cat: Category) => ({ value: cat, label: cat })),
  ];

  const handleCategoryChange = (val: string) => {
    if (CATEGORIES.includes(val as Category)) {
      setValue("category", val as Category);
    } else {
      setValue("category", "noun");
      setValue("isIrregular", false);
    }
  };

  return (
    <>
     
      <div className={css.customSelectWrapper}>
        <SortDropdown
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={categoryOptions}
          theme="light"
        />
        <p className={css.error}>{errors.category?.message}</p>
      </div>

          {selectedCategory === "verb" && (
        <div className={css.radioGroup}>
          {[{ label: "Regular", value: false }, { label: "Irregular", value: true }].map(
            (opt) => (
              <div
                key={String(opt.value)}
                className={`${css.radioCustomWrapper} ${
                  isIrregularChecked === opt.value ? css.active : ""
                }`}
                onClick={() => setValue("isIrregular", opt.value)}
              >
                <div className={css.radioCircle}>
                  {isIrregularChecked === opt.value && (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect
                        x="1"
                        y="1"
                        width="16"
                        height="16"
                        rx="8"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <rect
                        x="4"
                        y="4"
                        width="10"
                        height="10"
                        rx="5"
                        fill="#fff"
                      />
                    </svg>
                  )}
                </div>
                <span className={css.radioText}>{opt.label}</span>
              </div>
            )
          )}
          {isIrregularChecked && (
            <p className={css.radioHint}>
              Enter the verb in I-form-II-form-III-form format (e.g., go-went-gone).
            </p>
          )}
        </div>
      )}

           <div className={`${css.inputWithFlag} ${css.fieldSpacing}`}>
        <div className={css.flagWrapper}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="14" fill="#FFDA44" />
            <path d="M0 14C0 6.26806 6.26806 0 14 0C21.7319 0 28 6.26806 28 14H0Z" fill="#338AF3" />
          </svg>
          <p className={css.text}>Ukrainian</p>
        </div>
        <input
          {...register("ua")}
          placeholder="Ukrainian"
          className={errors.ua ? css.inputError : ""}
        />
      </div>
      <p className={css.error}>{errors.ua?.message}</p>

      {/* English */}
      <div className={`${css.inputWithFlag} ${css.fieldSpacing}`}>
        <div className={css.flagWrapper}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="14" fill="#F0F0F0" />
            {/* Прапор Англії */}
            <path d="M2.8942 5.4765C1.79448 6.90729 0.965258 8.55639 0.482422 10.3479H7.76559L2.8942 5.4765Z" fill="#0052B4" />
            <path d="M27.5174 10.3479C27.0346 8.55645 26.2053 6.90735 25.1057 5.47656L20.2344 10.3479H27.5174Z" fill="#0052B4" />
            <path d="M0.482422 17.6523C0.965312 19.4437 1.79454 21.0928 2.8942 22.5236L7.76543 17.6523H0.482422Z" fill="#0052B4" />
            <path d="M22.5237 2.89413C21.0929 1.79442 19.4439 0.96519 17.6523 0.4823V7.76542L22.5237 2.89413Z" fill="#0052B4" />
            <path d="M5.47656 25.1059C6.90735 26.2056 8.55645 27.0349 10.3479 27.5177V20.2347L5.47656 25.1059Z" fill="#0052B4" />
            <path d="M10.3479 0.4823C8.5564 0.96519 6.9073 1.79442 5.47656 2.89407L10.3479 7.76536V0.4823Z" fill="#0052B4" />
            <path d="M17.6523 27.5177C19.4438 27.0349 21.0929 26.2056 22.5236 25.106L17.6523 20.2347V27.5177Z" fill="#0052B4" />
            <path d="M20.2344 17.6523L25.1057 22.5236C26.2053 21.0929 27.0346 19.4437 27.5174 17.6523H20.2344Z" fill="#0052B4" />
            <path d="M27.8815 12.1739H15.8262V0.118508C15.2283 0.0406875 14.6189 0 14 0C13.381 0 12.7717 0.0406875 12.1739 0.118508V12.1738H0.118508C0.0406875 12.7717 0 13.3811 0 14C0 14.619 0.0406875 15.2283 0.118508 15.8261H12.1738V27.8815C12.7717 27.9593 13.381 28 14 28C14.6189 28 15.2283 27.9594 15.8261 27.8815V15.8262H27.8815C27.9593 15.2283 28 14.619 28 14C28 13.3811 27.9593 12.7717 27.8815 12.1739Z" fill="#D80027" />
          </svg>
          <p className={css.text}>English</p>
        </div>
        <input
          {...register("en")}
          placeholder="English"
          className={errors.en ? css.inputError : ""}
        />
      </div>
      <p className={css.error}>{errors.en?.message}</p>
    </>
  );
}