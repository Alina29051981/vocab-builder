// app/(private routes)/recommend/RecommendClient.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRecommendedWords, getUserStatistics, addWordFromOtherUser } from "@/lib/api/words";
import WordsTable from "@/components/words/WordsTable";
import WordsPagination from "@/components/words/WordsPagination";
import Filters from "@/components/Dashboard/Filters";
import { PaginatedWordsResponse, Category, Word } from "@/types/word";
import toast from "react-hot-toast";
import css from "./Recommend.module.css";

export default function RecommendClient() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [isIrregular, setIsIrregular] = useState<boolean | null>(null);
  const [addedWordIds, setAddedWordIds] = useState<Set<string>>(new Set());

    const { data, isLoading } = useQuery<PaginatedWordsResponse>({
    queryKey: ["recommendWords", page, keyword, category, isIrregular],
    queryFn: () =>
      getRecommendedWords({
        page,
        limit: 7,
        keyword: keyword || undefined,
        category: category || undefined,
        isIrregular: category === "verb" ? isIrregular ?? undefined : undefined,
      }),
    placeholderData: (prev) => prev,
    retry: 1,
  });

  const words: Word[] = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;

    const { data: statsData } = useQuery<{ totalCount: number }>({
    queryKey: ["recommendWordsCount"],
    queryFn: () => getUserStatistics(),
    placeholderData: { totalCount: 0 },
    retry: 1,
  });
  const totalCount = statsData?.totalCount ?? 0;

    const handleAddWord = async (wordId: string) => {
    if (addedWordIds.has(wordId)) return;

    try {
      await addWordFromOtherUser(wordId);
      toast.success("Word added successfully");

            setAddedWordIds(new Set(addedWordIds).add(wordId));
    } catch (err: unknown) {
      console.error("addWordFromOtherUser error:", err);
      toast.error("Failed to add word. Maybe it is already in your dictionary.");
    }
  };

  return (
    <div className={`container ${css.recommendPage}`}>
      <div className={css.dashboardWrapper}>
        <Filters
          className={css.Wrapper}
          onChange={({ keyword, category, isIrregular }) => {
            setKeyword(keyword);
            setCategory(category);
            setIsIrregular(category === "verb" ? isIrregular ?? null : null);
          }}
        />
      </div>

      <div className={css.counterWrapper}>
        <p className={css.studyText}>
          To study: <span className={css.studyNumber}>{totalCount}</span>
        </p>
        <a href="/training" className={css.trainButton}>
          Train oneself <span className={css.trainArrow}>→</span>
        </a>
      </div>

      <div className={css.wordsTableWrapper}>
        <WordsTable
          data={words}
          loading={isLoading}
          variant="recommend"
          showArrow
          addedWordIds={addedWordIds}
          onAddWord={handleAddWord}
        />
      </div>

      <div className={css.paginationWrapper}>
        <WordsPagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}