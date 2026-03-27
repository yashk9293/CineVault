import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth(); // Use the state from context

  if (!token) {
    return <Navigate to="/" replace />; // 'replace' prevents going back to locked page
  }

  return children;
}