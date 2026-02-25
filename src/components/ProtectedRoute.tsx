import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const userId = useAuthStore((state) => state.userId);
  console.log("Protected Route", userId);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
