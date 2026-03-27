import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { token } = useAuth();

  // Agar token mil gaya, toh sidha Home bhej do
  if (token) {
    return <Navigate to="/home" replace />;
  }

  // Agar token nahi hai, toh Login/Signup page dikhao
  return children;
}