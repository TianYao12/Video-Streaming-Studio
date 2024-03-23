import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

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
        if (authUser && authUser.username) {
          // Check if authUser and its username property are defined
          const response = await axios.get(
            "http://localhost:8001/s3/getMovies",
            {
              params: { username: authUser.username }, // Send username as a query parameter
              headers: { "Content-Type": "application/json" }, // Headers should be outside params
            }
          );

          console.log(response.data);
          setData(response.data);
        }
      } catch (error) {
        console.error("Error posting movies:", error);
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

    await axios.post("http://localhost:8001/s3/movies", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    window.location.reload();
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
          <div className="mt-30 text-white">
            <h1 className="text-3xl">Uploaded by {authUser.username}</h1>
            {/* {data.map((d) => {
              d
            })} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadForm;
