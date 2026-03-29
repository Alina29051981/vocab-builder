// components/modals/AddWordModal/AddWordModal.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createWord } from "../../../lib/api/words";
import { createWordSchema, FormValues } from "../../../lib/validation/createWordSchema";
import css from "./AddWordModal.module.css";
import { CATEGORIES, CreateNewWordRequest, Word } from "../../../types/word";
import { AxiosError } from "axios";
import type { Resolver } from "react-hook-form"; 

interface Props {
  onClose: () => void;
  onWordAdded: (newWord: Word) => void;
}

export default function AddWordModal({ onClose, onWordAdded }: Props) {
  const queryClient = useQueryClient();

 

  const {
  register,
  handleSubmit,
  watch,
  setValue,
  formState: { errors, isSubmitting },
} = useForm<FormValues>({
  resolver: yupResolver(createWordSchema) as Resolver<FormValues>, 
  defaultValues: {
    en: "",
    ua: "",
    category: "noun",
    isIrregular: false,
  },
});

  const selectedCategory = watch("category");
  const isIrregularChecked = watch("isIrregular");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const payload: CreateNewWordRequest = {
        en: data.en.trim(),
        ua: data.ua.trim(),
        category: data.category,
        isIrregular: data.category === "verb" ? data.isIrregular : false,
      };

      const createdWord = await createWord(payload);

      const newWord: Word = {
        ...createdWord,
        category: createdWord.category as Word["category"],
      };

      toast.success("Word added successfully");
      await queryClient.invalidateQueries({ queryKey: ["ownWords"] });
      onWordAdded(newWord);
      onClose();
    } catch (err) {
      let message = "Failed to create word";
      if (err instanceof AxiosError) {
        message = err.response?.data?.message ?? err.message;
        console.error("createWord AxiosError:", err.response?.data);
      } else if (err instanceof Error) {
        message = err.message;
        console.error("createWord unknown error:", err);
      }
      toast.error(message);
    }
  };

  return (
    <div className={css.backdrop}>
      <div className={css.modal}>
        <div className={css.closeBtn}>
          <button type="button" onClick={onClose} aria-label="Close">
            <svg className="icon icon-x">
              <use href="#icon-x" width="24" height="24" />
            </svg>
          </button>
        </div>

        <h2 className={css.h1}>Add word</h2>
        <p className={css.text}>
          Adding a new word to the dictionary enriches the language base.
        </p>

        <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
          <select {...register("category")}>
            <option value="">Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <p className={css.error}>{errors.category?.message}</p>

          {selectedCategory === "verb" && (
            <div className={css.radioGroup}>
              <label className={css.radioLabel}>
                <input
                  type="radio"
                  value="false"
                  checked={isIrregularChecked === false}
                  onChange={() => setValue("isIrregular", false)}
                  className={css.radioInput}
                />
                <span className={css.customRadio}>
                  <svg className={css.icon}>
                    <use href="/sprite.svg#icon-check" />
                  </svg>
                </span>
                <span className={css.radioText}>Regular</span>
              </label>

              <label className={css.radioLabel}>
                <input
                  type="radio"
                  value="true"
                  checked={isIrregularChecked === true}
                  onChange={() => setValue("isIrregular", true)}
                  className={css.radioInput}
                />
                <span className={css.customRadio}>
                  <svg className={css.icon}>
                    <use href="/sprite.svg#icon-check" />
                  </svg>
                </span>
                <span className={css.radioText}>Irregular</span>
              </label>

              {isIrregularChecked && (
                <p className={css.hint}>
                  Enter the verb in I-form-II-form-III-form format (e.g., go-went-gone).
                </p>
              )}
            </div>
          )}

          <div className={css.flagWrapper}>
            <svg width="28" height="28">
              <use xlinkHref="#flag-ukraine" />
            </svg>
            <p className={css.text}>Ukrainian</p>
          </div>
          <input {...register("ua")} placeholder="Ukrainian" />
          <p className={css.error}>{errors.ua?.message}</p>

          <div className={css.flagWrapper}>
            <svg width="28" height="28">
              <use xlinkHref="#flag-england" />
            </svg>
            <p className={css.text}>English</p>
          </div>
          <input
            {...register("en")}
            placeholder={
              isIrregularChecked
                ? "English (I-form-II-form-III-form, e.g., go-went-gone)"
                : "English"
            }
          />
          <p className={css.error}>{errors.en?.message}</p>

          <div className={css.buttons}>
            <button className={css.buttonSave} type="submit" disabled={isSubmitting}>
              Add
            </button>
            <button className={css.buttonCancel} type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}