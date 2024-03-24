import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import LogoutButton from "./LogOutButton";

const Navbar = () => {
  const { authUser } = useAuthContext();
  const isAdmin = authUser && authUser.role === "Admin";

  return (
    <div className="flex items-center justify-between p-4 z-[100] w-full absolute">
      <Link to="/">
        <h1 className="text-red-600 text-4xl font-bold cursor-pointer">
          NETFLIX
        </h1>
      </Link>
      <div className="flex">
        {isAdmin && (
          <Link to="/upload">
            <button className="text-white pr-4">Upload</button>
          </Link>
        )}
        <LogoutButton />
      </div>
    </div>
  );
};

export default Navbar;
