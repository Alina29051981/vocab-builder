"use client";

import css from "./WordFormFields.module.css";
import { CATEGORIES, Category } from "../../../types/word";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormValues } from "../../../lib/validation/createWordSchema";
import SortDropdown from "../../SortDropdown/SortDropdown";

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export default function WordFormFields({ register, errors, watch, setValue }: Props) {
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
                    <svg width="18" height="18">
                      <use href="#dropdown" />
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

          <div className={css.inputWithFlag}>
        <div className={css.flagWrapper}>
          <svg width="28" height="28">
            <use xlinkHref="#flag-ukraine" />
          </svg>
          <p className={css.text}>Ukrainian</p>
        </div>
        <input {...register("ua")} placeholder="Ukrainian" />
      </div>
      <p className={css.error}>{errors.ua?.message}</p>

      {/* English */}
      <div className={css.inputWithFlag}>
        <div className={css.flagWrapper}>
          <svg width="28" height="28">
            <use xlinkHref="#flag-england" />
          </svg>
          <p className={css.text}>English</p>
        </div>
        <input
          {...register("en")}
          placeholder={isIrregularChecked ? "English (I-form-II-form-III-form)" : "English"}
        />
      </div>
      <p className={css.error}>{errors.en?.message}</p>
    </>
  );
}