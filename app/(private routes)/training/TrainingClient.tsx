// app/(private routes)/training/TrainingClient.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TrainingRoom from "../../../components/training/TrainingRoom";
import { getTrainingWords, postTrainingAnswers } from "../../../lib/api/training";
import Loader from "../../loading";
import EmptyState from "../../../components/ui/EmptyState";
import toast from "react-hot-toast";
import css from "./Training.module.css";
import type { TaskWord } from "@/types/training";

export type UserAnswer = {
  wordId: string;
  ua: string;
};

export default function TrainingPageClient() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["trainingWords"],
    queryFn: getTrainingWords,
    staleTime: 1000 * 60 * 5,
  });

  const words: TaskWord[] = data ?? [];

  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

    const mutation = useMutation({
    mutationFn: (answers: UserAnswer[]) =>
      postTrainingAnswers(
        answers.map(a => ({
          _id: a.wordId,
          en: words.find(w => w._id === a.wordId)?.en || "",
          ua: a.ua,
          task: "en",
        }))
      ),
    onSuccess: () => {
      toast.success("Всі відповіді успішно збережені!");
      setUserAnswers([]);
      queryClient.invalidateQueries({ queryKey: ["trainingWords"] });
    },
    onError: () => toast.error("Не вдалося зберегти відповіді. Спробуйте пізніше."),
  });

  const handleSaveAnswer = (wordId: string, uaAnswer: string) => {
    if (!uaAnswer.trim()) return;

    setUserAnswers(prev => {
      const exists = prev.find(a => a.wordId === wordId);
      if (exists) {
        return prev.map(a => (a.wordId === wordId ? { wordId, ua: uaAnswer } : a));
      }
      return [...prev, { wordId, ua: uaAnswer }];
    });
  };

  const handleFinishTraining = () => {
    if (userAnswers.length > 0) {
      mutation.mutate(userAnswers);
    }
  };

  const handleWordAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["trainingWords"] });
  };

  if (isLoading)
    return (
      <div className={css.wrapper}>
        <Loader />
      </div>
    );

  if (isError)
    return (
      <div className={css.wrapper}>
        <p className={css.error}>Щось пішло не так</p>
      </div>
    );

  if (!words || words.length === 0)
    return (
      <div className={css.wrapper}>
        <EmptyState
          onCancel={() => {}}
          onWordAdded={handleWordAdded} 
        />
      </div>
    );

  return (
    <div className={css.wrapper}>
      <TrainingRoom
        words={words}
        onSaveAnswer={handleSaveAnswer}
        onFinish={handleFinishTraining}
      />
    </div>
  );
}