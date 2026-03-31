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
import type { Resolver } from "react-hook-form";

import WordFormFields from "../WordFormFields/WordFormFields"; 

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const payload = {
        en: data.en.trim(),
        ua: data.ua.trim(),
        category: data.category,
        ...(data.category === "verb"
          ? { isIrregular: data.isIrregular }
          : {}),
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
    } catch (err) {
      let message = "Failed to create word";

      if (err instanceof AxiosError) {
        message = err.response?.data?.message ?? err.message;
      } else if (err instanceof Error) {
        message = err.message;
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
          
          <WordFormFields
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

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