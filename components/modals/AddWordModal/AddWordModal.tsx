"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createWord } from "../../../lib/api/words";
import { createWordSchema, FormValues } from "../../../lib/validation/createWordSchema";
import css from "./AddWordModal.module.css";
import { Word } from "../../../types/word";
import { AxiosError } from "axios";
import type { Resolver, FieldError, FieldErrors } from "react-hook-form";
import WordFormFields from "../WordFormFields/WordFormFields"; 
import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
  onWordAdded: (newWord: Word) => void;
}

function mapServerErrorsToFieldErrors(
  serverErrors: Partial<Record<keyof FormValues, string>>
): FieldErrors<FormValues> {
  const result: FieldErrors<FormValues> = {};
  for (const key in serverErrors) {
    const msg = serverErrors[key as keyof FormValues];
    if (msg) {
      result[key as keyof FormValues] = { type: "server", message: msg } as FieldError;
    }
  }
  return result;
}

export default function AddWordModal({ onClose, onWordAdded }: Props) {
  const queryClient = useQueryClient();
  const [serverErrors, setServerErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setServerErrors({});
    try {
      const payload = {
        en: data.en.trim(),
        ua: data.ua.trim(),
        category: data.category,
        ...(data.category === "verb" ? { isIrregular: data.isIrregular } : {}),
      };

      const createdWord = await createWord(payload);

      const newWord: Word = {
        ...createdWord,
        category: createdWord.category as Word["category"],
        isIrregular: data.category === "verb" ? data.isIrregular : false,
      };

      toast.success("Word added successfully");
      await queryClient.invalidateQueries({ queryKey: ["ownWords"] });
      onWordAdded(newWord);
      onClose();
    } catch (err: unknown) {
      let message = "Failed to create word";

      if (err instanceof AxiosError) {
        message = err.response?.data?.message ?? err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      if (/en field/i.test(message) || /English letters/i.test(message)) fieldErrors.en = message;
      if (/ua field/i.test(message) || /Ukrainian letters/i.test(message)) fieldErrors.ua = message;

      if (Object.keys(fieldErrors).length === 0) toast.error(message);
      setServerErrors(fieldErrors);
    }
  };

  return (
    <div className={css.backdrop}>
      <div className={css.modal}>
        <div className={css.closeBtn}>
          <button type="button" onClick={onClose} aria-label="Close">
            <svg className="icon icon-x">
              <use href="/sprite.svg#icon-x" width="24" height="24" />
            </svg>
          </button>
        </div>

        <h2 className={css.h1}>Add word</h2>
        <p className={css.text}>
          Adding a new word to the dictionary enriches the language base.
        </p>

        <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
          <div className="modal"><WordFormFields
            register={register}
            errors={{ ...errors, ...mapServerErrorsToFieldErrors(serverErrors) }}
            watch={watch}
            setValue={setValue}
          />
</div>
          <div className={css.buttons}>
            <button
              className={css.buttonSave}
              type="submit"
              disabled={isSubmitting}
            >
              Add
            </button>
            <button
              className={css.buttonCancel}
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}