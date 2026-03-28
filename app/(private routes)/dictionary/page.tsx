// app/(private routes)/dictionary/page.tsx

import DictionaryClient from "./DictionaryClient";
import ProtectedRoute from "../../../components/ProtectedRoute/ProtectedRoute.client";

export default function DictionaryPage() {
  return (
    <ProtectedRoute>
           <DictionaryClient />
    </ProtectedRoute>
  );
}