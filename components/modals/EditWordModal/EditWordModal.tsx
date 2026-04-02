"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editWord } from "../../../lib/api/words";
import { editWordSchema } from "../../../lib/validation/editWordSchema";
import type { FormValues } from "../../../lib/validation/editWordSchema";
import type { EditWordRequest, Word } from "../../../types/word";
import type { SubmitHandler } from "react-hook-form";import css from "./EditWordModal.module.css";

interface Props {
  word: Word;
  onClose: () => void;
}

export default function EditWordModal({ word, onClose }: Props) {
  const queryClient = useQueryClient();
  const [serverErrors, setServerErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(editWordSchema),
    defaultValues: { en: "", ua: "" },
  });

  useEffect(() => {
    reset({ en: word.en, ua: word.ua });
  }, [word, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setServerErrors({});
    try {
      const payload: EditWordRequest = {
        en: data.en.trim(),
        ua: data.ua.trim(),
        category: word.category,
        ...(word.category === "verb" ? { isIrregular: word.isIrregular } : {}),
      };

      await editWord(word._id, payload);
      toast.success("Word updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["ownWords"] });
      onClose();
    } catch (unknownErr: unknown) {
      const err = unknownErr as { response?: { data?: { message?: string } }; message?: string };
      const message = err.response?.data?.message || err.message || "Failed to update word";

      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      if (/en field/i.test(message) || /English letters/i.test(message)) fieldErrors.en = message;
      if (/ua field/i.test(message) || /Ukrainian letters/i.test(message)) fieldErrors.ua = message;

      if (Object.keys(fieldErrors).length === 0) toast.error(message);
      setServerErrors(fieldErrors);
      console.error("editWord error:", err);
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
          <div className={css.inputWithFlag}>
            <input
              {...register("ua")}
              placeholder="Ukrainian"
              className={errors.ua || serverErrors.ua ? css.inputError : ""}
            />
            <div className={css.flagWrapper}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="14" fill="#FFDA44" />
                <path d="M0 14C0 6.26806 6.26806 0 14 0C21.7319 0 28 6.26806 28 14H0Z" fill="#338AF3" />
              </svg>
              <p>Ukrainian</p>
            </div>
          </div>
          <p className={css.error}>{errors.ua?.message || serverErrors.ua}</p>

          <div className={css.inputWithFlag}>
            <input
              {...register("en")}
              placeholder="English"
              className={errors.en || serverErrors.en ? css.inputError : ""}
            />
            <div className={css.flagWrapper}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="14" fill="#F0F0F0" />
                <path d="M2.8942 5.4765C1.79448 6.90729 0.965258 8.55639 0.482422 10.3479H7.76559L2.8942 5.4765Z" fill="#0052B4" />
                <path d="M27.5174 10.3479C27.0346 8.55645 26.2053 6.90735 25.1057 5.47656L20.2344 10.3479H27.5174Z" fill="#0052B4" />
                <path d="M0.482422 17.6523C0.965312 19.4437 1.79454 21.0928 2.8942 22.5236L7.76543 17.6523H0.482422Z" fill="#0052B4" />
                <path d="M22.5237 2.89413C21.0929 1.79442 19.4439 0.96519 17.6523 0.4823V7.76542L22.5237 2.89413Z" fill="#0052B4" />
                <path d="M5.47656 25.1059C6.90735 26.2056 8.55645 27.0349 10.3479 27.5177V20.2347L5.47656 25.1059Z" fill="#0052B4" />
                <path d="M10.3479 0.4823C8.5564 0.96519 6.9073 1.79442 5.47656 2.89407L10.3479 7.76536V0.4823Z" fill="#0052B4" />
                <path d="M17.6523 27.5177C19.4438 27.0349 21.0929 26.2056 22.5236 25.106L17.6523 20.2347V27.5177Z" fill="#0052B4" />
                <path d="M20.2344 17.6523L25.1057 22.5236C26.2053 21.0929 27.0346 19.4437 27.5174 17.6523H20.2344Z" fill="#0052B4" />
                <path d="M27.8815 12.1739H15.8262H15.8261V0.118508C15.2283 0.0406875 14.6189 0 14 0C13.381 0 12.7717 0.0406875 12.1739 0.118508V12.1738V12.1739H0.118508C0.0406875 12.7717 0 13.3811 0 14C0 14.619 0.0406875 15.2283 0.118508 15.8261H12.1738H12.1739V27.8815C12.7717 27.9593 13.381 28 14 28C14.6189 28 15.2283 27.9594 15.8261 27.8815V15.8262V15.8261H27.8815C27.9593 15.2283 28 14.619 28 14C28 13.3811 27.9593 12.7717 27.8815 12.1739V12.1739Z" fill="#D80027" />
                <path d="M17.6523 17.6523L23.8996 23.8996C24.187 23.6123 24.461 23.312 24.7226 23.0008L19.374 17.6522H17.6523V17.6523Z" fill="#D80027" />
                <path d="M10.3469 17.6522H10.3468L4.09961 23.8994C4.38683 24.1868 4.68712 24.4609 4.9984 24.7224L10.3469 19.3737V17.6522Z" fill="#D80027" />
                <path d="M10.3476 10.3479V10.3478L4.10028 4.10046C3.81295 4.38768 3.53886 4.68797 3.27734 4.99925L8.62594 10.3479H10.3476V10.3479Z" fill="#D80027" />
                <path d="M17.6523 10.3479L23.8997 4.10053C23.6125 3.8132 23.3122 3.53911 23.0009 3.27765L17.6523 8.62625V10.3479Z" fill="#D80027" />
              </svg>
              <p>English</p>
            </div>
          </div>
          <p className={css.error}>{errors.en?.message || serverErrors.en}</p>

          <div className={css.buttons}>
            <button className={css.buttonSave} type="submit" disabled={isSubmitting}>
              Save
            </button>
            <button className={css.buttonCancel} type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}