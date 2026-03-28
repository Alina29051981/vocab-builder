// components/modals/EditWordModal.tsx
"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editWord } from "../../../lib/api/words";
import { createWordSchema, FormValues } from "../../../lib/validation/createWordSchema";
import css from "./EditWordModal.module.css";
import { Word, CATEGORIES } from "../../../types/word";

interface Props {
  word: Word;
  onClose: () => void;
}

export default function EditWordModal({ word, onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(createWordSchema),
    defaultValues: {
      en: word.en,
      ua: word.ua,
      category: word.category,
      isIrregular: word.isIrregular ?? false,
    },
  });

  useEffect(() => {
    reset({
      en: word.en,
      ua: word.ua,
      category: word.category,
      isIrregular: word.isIrregular ?? false,
    });
  }, [word, reset]);

  const selectedCategory = watch("category");
  const isIrregularChecked = watch("isIrregular");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const payload = { ...data };
      if (payload.category !== "verb") {
        delete payload.isIrregular;
      }
      await editWord(word._id, payload);
      toast.success("Word updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["ownWords"] });
      onClose();
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to update word");
    }
  };

  return (
    <div className={css.backdrop}>
      <div className={css.modal}>
       
        <div className={css.closeBtn}>
           <button type="button" onClick={onClose} aria-label="Close">
    <svg className="icon icon-x"><use href="#icon-x" width="24" height="24"></use></svg>
            </button>
        </div>

        <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
          <select {...register("category")}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <p className={css.error}>{errors.category?.message}</p>

          {selectedCategory === "verb" && (
            <div className={css.verbType}>
              <label className={css.label}>
                <input
                  type="radio"
                  value="false"
                  checked={isIrregularChecked === false}
                  onChange={() => setValue("isIrregular", false)}
                />
                Regular
              </label>
              <label className={css.label}>
                <input
                  type="radio"
                  value="true"
                  checked={isIrregularChecked === true}
                  onChange={() => setValue("isIrregular", true)}
                />
                Irregular
              </label>
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
                ? "English (I-form-II-form-III-form, e.g. go-went-gone)"
                : "English"
            }
          />
          <p className={css.error}>{errors.en?.message}</p>

                    <div className={css.buttons}>
            <button className={css.buttonSave}type="submit" disabled={isSubmitting}>
              Save
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