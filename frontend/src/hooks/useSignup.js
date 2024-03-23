import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { authUser, setAuthUser } = useAuthContext();

  const signup = async ({
    username,
    email,
    password,
    confirmPassword,
    role,
  }) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/signup`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
          role: role ? role : "Guest",
        }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // localstorage
      localStorage.setItem("netflix-user", JSON.stringify(data));
      console.log("data",JSON.stringify(data))
      // context
      setAuthUser(data);
      console.log(JSON.parse(localStorage.getItem("netflix-user")) || null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, signup };
};

export default useSignup;

function handleInputErrors({
  username,
  email,
  password,
  confirmPassword,
  role,
}) {
  if (!username || !email || !password || !confirmPassword || !role) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }
  return true;
}
