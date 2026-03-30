// app/(private routes)/dictionary/DictionaryClient.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getOwnWords, deleteWord } from "../../../lib/api/words"; 
import Filters from "../../../components/Dashboard/Filters";
import WordsTable from "../../../components/words/WordsTable";
import WordsPagination from "../../../components/words/WordsPagination";
import AddWordModal from "../../../components/modals/AddWordModal/AddWordModal";
import { Category, PaginatedWordsResponse, Word } from "../../../types/word";
import css from "./Dictionary.module.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function DictionaryClient() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [isIrregular, setIsIrregular] = useState<boolean | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
const searchParams = useSearchParams();

  useEffect(() => {
  if (searchParams.get("addWord") === "true") {
    setIsAddOpen(true);
  }
}, [searchParams]);
  
  const router = useRouter();
  const queryClient = useQueryClient();

 const { data, isLoading } = useQuery<PaginatedWordsResponse>({
  queryKey: ["ownWords", page, keyword, category, isIrregular],
  queryFn: () =>
    getOwnWords({
      page,
      limit: 7,
      keyword: keyword || undefined,
      category: category || undefined,
      isIrregular: isIrregular ?? undefined,
    }),
  placeholderData: (prev) => prev,
  retry: 1, 
});

  const words: Word[] = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;
  const perPage = data?.perPage ?? 7;
  const totalCount = (totalPages - 1) * perPage + words.length;

  const filteredWords =
    category === "verb" && isIrregular !== null
      ? words.filter((w) => w.isIrregular === isIrregular)
      : words;

   const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWord(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["ownWords", page, keyword, category, isIrregular] });

      const previousData = queryClient.getQueryData<PaginatedWordsResponse>([
        "ownWords",
        page,
        keyword,
        category,
        isIrregular,
      ]);

      if (previousData) {
        queryClient.setQueryData<PaginatedWordsResponse>(
          ["ownWords", page, keyword, category, isIrregular],
          {
            ...previousData,
            results: previousData.results.filter((w) => w._id !== id),
          }
        );
      }

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["ownWords", page, keyword, category, isIrregular],
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ownWords"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this word?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (word: Word) => {
    console.log("Edit word:", word);
  };

    const handleAddWord = () => {
    queryClient.invalidateQueries({ queryKey: ["ownWords"], exact: false });
    setIsAddOpen(false);
  };

  const handleTrain = () => {
  router.push("/training");
  };
  
  return (
    <div className={css.dictionaryPage}>
      <div className="container">
        <div className={css.dashboardWrapper}>
          <Filters
            onChange={({ keyword, category, isIrregular }) => {
              setKeyword(keyword);
              setCategory(category);
              setIsIrregular(category === "verb" ? isIrregular ?? null : null);
            }}
          />
        </div>

        <div className={css.counterWrapper}>
          <p className={css.studyText}>
            To study: <span className={css.studyNumber}>{isLoading ? "..." : totalCount}</span>
          </p>

          <div className={css.topButtons}>
            <div className={css.addWordLink} onClick={() => setIsAddOpen(true)}>
              Add word <span className={css.plus}>+</span>
            </div>

            <div className={css.trainButton} onClick={handleTrain}>
              Train oneself <span className={css.trainArrow}>→</span>
            </div>
          </div>
        </div>

        <div className={css.wordsTableWrapper}>
          <WordsTable
            data={filteredWords}
            loading={isLoading}
            variant="dictionary"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className={css.paginationWrapper}>
          <WordsPagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

           {isAddOpen && (
        <AddWordModal
          onClose={() => setIsAddOpen(false)} 
          onWordAdded={handleAddWord}      
        />
      )}
    </div>
  );
}