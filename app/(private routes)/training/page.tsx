// app/(private routes)/training/page.tsx
import TrainingPageClient from "./TrainingClient";
import ProtectedRoute from "../../../components/ProtectedRoute/ProtectedRoute.client";

export default function TrainingPage() {
  return (
    <ProtectedRoute>
      <TrainingPageClient />
    </ProtectedRoute>
  );
}