import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import UploadForm from "./components/Upload";

function App() {
  const { authUser } = useAuthContext();
  return (
    <>
      {authUser && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/upload"
          element={authUser ? <UploadForm /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
