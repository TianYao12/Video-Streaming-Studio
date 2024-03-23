import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogOut = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(false);
    try {
      const response = await fetch("http://localhost:8001/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.removeItem("netflix-user");
      setAuthUser(null);
      navigate("/");
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, logout };
};

export default useLogOut;
