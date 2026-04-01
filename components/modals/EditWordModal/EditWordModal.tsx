"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editWord } from "../../../lib/api/words";
import { createWordSchema, FormValues } from "../../../lib/validation/createWordSchema";
import css from "./EditWordModal.module.css";
import { EditWordRequest, Word, CATEGORIES } from "../../../types/word";
import type { Resolver } from "react-hook-form";

interface Props {
  word: Word;
  onClose: () => void;
}

export default function EditWordModal({ word, onClose }: Props) {
  const queryClient = useQueryClient();

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [onClose]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(createWordSchema) as Resolver<FormValues>,
    defaultValues: { en: "", ua: "", category: "noun", isIrregular: false },
  });

  useEffect(() => {
    reset({
      en: word.en,
      ua: word.ua,
      category: word.category,
      isIrregular: word.isIrregular ?? false,
    });
  }, [word, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const payload: EditWordRequest = {
        en: data.en.trim(),
        ua: data.ua.trim(),
        category: data.category,
        ...(data.category === "verb" ? { isIrregular: data.isIrregular } : {}),
      };

      await editWord(word._id, payload);
      toast.success("Word updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["ownWords"] });
      onClose();
    } catch (err) {
      console.error("editWord error:", err);
      toast.error("Failed to update word");
    }
  };

  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <div className={css.closeBtn}>
          <button type="button" onClick={onClose} aria-label="Close">
            <svg className="icon icon-x" width="24" height="24">
              <use href="/sprite.svg#icon-x" />
            </svg>
          </button>
        </div>

        <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
          <select {...register("category")}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <p className={css.error}>{errors.category?.message}</p>

          <div className={css.inputWithFlag}>
            <input {...register("ua")} placeholder="Ukrainian" />
            <div className={css.flagWrapper}>
              <svg width="28" height="28">
                <use xlinkHref="#flag-ukraine" />
              </svg>
              <p>Ukrainian</p>
            </div>
          </div>
          <p className={css.error}>{errors.ua?.message}</p>

          <div className={css.inputWithFlag}>
            <input {...register("en")} placeholder="English" />
            <div className={css.flagWrapper}>
              <svg width="28" height="28">
                <use xlinkHref="#flag-england" />
              </svg>
              <p>English</p>
            </div>
          </div>
          <p className={css.error}>{errors.en?.message}</p>

          <div className={css.buttons}>
            <button className={css.buttonSave} type="submit" disabled={isSubmitting}>Save</button>
            <button className={css.buttonCancel} type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}