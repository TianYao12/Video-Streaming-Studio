import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import Movie from "./Movie";
const UploadForm = () => {
  const { authUser } = useAuthContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState(""); // because mongodb it is currently attribute url
  const [data, setData] = useState([]);

  useEffect(() => {
    const postMovies = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/s3/getmovies?createdBy=${authUser.username}`
        );
        const data = await response.json();
        setData(data);
        console.log("data", data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    postMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("url", url);
    formData.append("title", title);
    formData.append("createdBy", authUser.username);
    formData.append("description", description);
    formData.append("category", category);

    try {
      await axios.post("http://localhost:8001/s3/movies", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error uploading movie:", error);
    }
    window.location.reload();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8001/s3/movies/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center text-white">
        <h1 className="mb-20 text-5xl my-40">Netflix Studio</h1>
        <div className="flex justify-center space-x-40">
          <div className="flex flex-col text-white items-center h-screen">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center space-y-4"
            >
              <label htmlFor="fileInput" className="mb-0 text-3xl">
                Upload a Video File
              </label>
              <input
                id="fileInput"
                type="file"
                accept="video/*"
                onChange={(e) => setUrl(e.target.files[0])}
                className="mb-4 w-full py-2 px-4 bg-gray-700 rounded text-white"
              />

              <label htmlFor="title" className="mb-0">
                Video Title
              </label>
              <input
                id="title"
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className="mb-4 w-full py-2 px-4 bg-gray-700 rounded text-white"
              />
              <label htmlFor="descriptionInput" className="mb-0">
                Video Description
              </label>
              <input
                id="descriptionInput"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="mb-4 w-full py-2 px-4 bg-gray-700 rounded text-white"
              />
              <label htmlFor="categoryInput" className="mb-0">
                Category
              </label>
              <select
                id="categoryInput"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="mb-4 w-full py-2 px-4 bg-gray-700 rounded text-white"
              >
                <option value="">Select a Category</option>
                <option value="Trending">Trending</option>
                <option value="Recently Watched">Recently Watched</option>
                <option value="Horror">Horror</option>
              </select>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Upload to Cloud
              </button>
            </form>
          </div>
          <div className="mt-30 text-white flex flex-col">
            <h1 className="text-3xl">Uploaded by {authUser.username}</h1>
            {data
              ? data.map((movie) => {
                  return (
                    <div className="rounded p-5 mt-5 flex border items-center">
                      <div className="flex flex-col">
                        <p className="text-white">{movie.title}</p>
                        <Movie item={movie.full_url} />
                      </div>
                      <button
                        className="w-20 h-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDelete(movie._id)}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadForm;
