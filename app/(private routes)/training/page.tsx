// app/(private routes)/training/page.tsx

import ProtectedRoute from "../../../components/ProtectedRoute/ProtectedRoute.client";
import TrainingRoom from "./TrainingRoom";
export default function TrainingPage() {
  return
   <ProtectedRoute>
     <TrainingRoom />;
   </ProtectedRoute>
}