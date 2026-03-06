// app/(private)/recommend/page.tsx

export default function RecommendPage() {
  return (
    <>
      <Dashboard showAddWord={false} />
    <WordsTable
  data={data?.results ?? []}
  loading={isLoading}
  isRecommendPage={true}
/>
      <WordsPagination />
    </>
  );
}