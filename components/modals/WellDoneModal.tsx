import dynamic from "next/dynamic";

const AddWordModal = dynamic(
  () => import("@/components/modals/AddWordModal"),
  { ssr: false }
);