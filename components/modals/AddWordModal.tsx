"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createWord } from "@/lib/api/words";
import { createWordSchema } from "@/lib/validation/createWordSchema";
import css from "./AddWordModal.module.css";

type FormValues = {
  en: string;
  ua: string;
  category: string;
  isIrregular: boolean;
};

interface Props {
  onClose: () => void;
}

export default function AddWordModal({ onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(createWordSchema),
    defaultValues: {
      isIrregular: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createWord(data);

      toast.success("Word added successfully");

      await queryClient.invalidateQueries({
        queryKey: ["ownWords"],
      });

      onClose();
    } catch {
      toast.error("Failed to create word");
    }
  };

  return (
    <div className={css.backdrop}>
      <div className={css.modal}>
        <h2>Add word</h2>

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

          <label>
            <input type="checkbox" {...register("isIrregular")} />
            Is irregular (for verbs)
          </label>

          <button type="submit" disabled={isSubmitting}>
            Add
          </button>

          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}