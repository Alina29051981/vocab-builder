// components/AllWordsClient/AllWordsClient.tsx 
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllWords, deleteWord } from "@/lib/api/words";
import Filters from "@/components/Dashboard/Filters/Filters";
import WordsTable from "@/components/words/WordsTable";
import WordsPagination from "@/components/words/WordsPagination";
import AddWordModal from "@/components/modals/AddWordModal/AddWordModal";
import EditWordModal from "@/components/modals/EditWordModal/EditWordModal";
import type { Category, Word, PaginatedWordsResponse } from "@/types/word";

export default function AllWordsClient() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  const { data, isLoading } = useQuery<PaginatedWordsResponse>({
    queryKey: ["allWords", page, keyword, category],
    queryFn: () =>
      getAllWords({
        page,
        limit: 10,
        keyword: keyword || undefined,
        category: category || undefined,
      }),
    placeholderData: (prev) => prev as PaginatedWordsResponse,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWord(id),
    onSuccess: async () => {
      toast.success("Word deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["allWords"] });
    },
    onError: () => toast.error("Failed to delete word"),
  });

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setIsAddOpen(true)}>Add word</button>
      </div>

           <Filters
  onChange={({ keyword, category }) => {
    setKeyword(keyword);
    setCategory(category);
    setPage(1);
  }}
/>

      {isAddOpen && (
        <AddWordModal
          onClose={() => setIsAddOpen(false)}
          onWordAdded={() => {
            toast.success("Word added!");
            queryClient.invalidateQueries({ queryKey: ["allWords"] });
          }}
        />
      )}

      {editingWord && (
        <EditWordModal
          word={editingWord}
          onClose={() => setEditingWord(null)}
        />
      )}

      <WordsTable
        data={data?.results ?? []}
        loading={isLoading}
        onEdit={(word) => setEditingWord(word)}
        onDelete={(id) => {
          if (confirm("Delete this word?")) deleteMutation.mutate(id);
        }}
      />

      <WordsPagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        onChange={setPage}
      />
    </>
  );
}