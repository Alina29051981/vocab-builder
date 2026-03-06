"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getOwnWords } from "@/lib/api/words";
import Filters from "@/components/Filters/Filters";
import WordsTable from "@/components/words/WordsTable";
import WordsPagination from "@/components/words/WordsPagination";
import AddWordModal from "@/components/modals/AddWordModal";

export default function DictionaryClient() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["ownWords", page, keyword, category],
    queryFn: () =>
      getOwnWords({
        page,
        limit: 10,
        keyword,
        category,
      }),
    placeholderData: (prev) => prev,
  });

  return (
    <>
      <div>
        <button onClick={() => setIsAddOpen(true)}>
          Add word
        </button>
      </div>

      <Filters
        onKeywordChange={(value) => {
          setKeyword(value);
          setPage(1);
        }}
        onCategoryChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
      />

      <WordsTable
        data={data?.results ?? []}
        loading={isLoading}
      />

      <WordsPagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onChange={setPage}
      />

      {isAddOpen && (
        <AddWordModal
          onClose={() => setIsAddOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["ownWords"],
            });
          }}
        />
      )}
    </>
  );
}