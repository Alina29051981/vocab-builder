"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editWord } from "@/lib/api/words";
import { createWordSchema } from "@/lib/validation/createWordSchema";
import css from "./EditWordModal.module.css";

type FormValues = {
  en: string;
  ua: string;
  category: string;
  isIrregular: boolean;
};

interface Props {
  word: {
    _id: string;
    en: string;
    ua: string;
    category: string;
    isIrregular?: boolean;
  };
  onClose: () => void;
}

export default function EditWordModal({ word, onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(createWordSchema),
    defaultValues: {
      en: "",
      ua: "",
      category: "",
      isIrregular: false,
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

  const onSubmit = async (data: FormValues) => {
    try {
      await editWord(word._id, data);

      toast.success("Word updated successfully");

      await queryClient.invalidateQueries({
        queryKey: ["ownWords"],
      });

      onClose();
    } catch {
      toast.error("Failed to update word");
    }
  };

  return (
    <div className={css.backdrop}>
      <div className={css.modal}>
        <h2>Edit word</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("en")} placeholder="English" />
          <p>{errors.en?.message}</p>

          <input {...register("ua")} placeholder="Ukrainian" />
          <p>{errors.ua?.message}</p>

          <select {...register("category")}>
            <option value="">Select category</option>
            <option value="verb">Verb</option>
            <option value="noun">Noun</option>
            <option value="adjective">Adjective</option>
            <option value="adverb">Adverb</option>
            <option value="pronoun">Pronoun</option>
            <option value="numerals">Numerals</option>
            <option value="preposition">Preposition</option>
            <option value="conjunction">Conjunction</option>
            <option value="phrasal verb">Phrasal verb</option>
            <option value="functional phrase">Functional phrase</option>
          </select>
          <p>{errors.category?.message}</p>

          {selectedCategory === "verb" && (
            <label>
              <input type="checkbox" {...register("isIrregular")} />
              Is irregular
            </label>
          )}

          <button type="submit" disabled={isSubmitting}>
            Save
          </button>

          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}