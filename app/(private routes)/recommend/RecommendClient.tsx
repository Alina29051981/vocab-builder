"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getRecommendedWords,
  getUserStatistics,
  addWordFromOtherUser,
  getUserWords,
} from "@/lib/api/words";
import WordsTable from "@/components/words/WordsTable";
import WordsPagination from "@/components/words/WordsPagination";
import Filters from "@/components/Dashboard/Filters/Filters";
import { PaginatedWordsResponse, Category, Word } from "@/types/word";
import css from "./Recommend.module.css";

type ApiError = { message: string };

export default function RecommendClient() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [isIrregular, setIsIrregular] = useState<boolean | null>(null);
  const [addedWordIds, setAddedWordIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
    const fetchAddedWords = async () => {
      try {
        const ownWords = await getUserWords();
        setAddedWordIds(new Set(ownWords.map((w) => w._id)));
      } catch (err) {
        console.error("Failed to load user words", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchAddedWords();
  }, []);

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
  });

  const words: Word[] = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;

   const { data: statsData } = useQuery<{ totalCount: number }>({
    queryKey: ["recommendWordsCount"],
    queryFn: () => getUserStatistics(),
    placeholderData: { totalCount: 0 },
  });
  const totalCount = statsData?.totalCount ?? 0;

    const handleAddWord = async (wordId: string) => {
    if (!isLoaded) return; 
    if (addedWordIds.has(wordId)) return; 

    try {
      await addWordFromOtherUser(wordId);
      setAddedWordIds((prev) => new Set(prev).add(wordId));
    } catch (err) {
      const error = err as ApiError;

      if (error.message.includes("Conflict")) {
       
        setAddedWordIds((prev) => new Set(prev).add(wordId));
      } else {
        alert(error.message || "Failed to add word.");
      }
    }
  };

  return (
    <div className={`container ${css.recommendPage}`}>
       <div className={css.counterFunctionWrapper}>
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
        </div>

      <div className={css.wordsTableWrapper}>
        <WordsTable
          data={words}
          loading={isLoading || !isLoaded} 
          variant="recommend"
          showArrow
          initialAddedWordIds={addedWordIds}
          onAddWord={handleAddWord}
        />
      </div>

      <div className={css.paginationWrapper}>
        <WordsPagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}