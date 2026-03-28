// app/(private routes)/recommend/page.tsx

import RecommendClient from "./RecommendClient";
import ProtectedRoute from "../../../components/ProtectedRoute/ProtectedRoute.client";

export default function RecommendPage() {
  return (
    <ProtectedRoute>
      <RecommendClient />
    </ProtectedRoute>
  );
}