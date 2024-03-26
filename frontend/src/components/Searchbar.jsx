import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Searchbar = () => {
  const [input, setInput] = useState("");
  const [data, setData] = useState("");

  const handleSubmit = async () => {
    const response = await fetch(
      `http://localhost:8001/search?search=${input}`
    );
    const data = await response.json();
    console.log(data);
    setData(data);
  };

  return (
    <div className="flex justify-end mr-8 mt-10">
      <div className="flex ">
        <FaSearch id="search-icon" className="text-white mr-3 mt-3" />
        <form onSubmit={handleSubmit}>
          <input
            className="p-1 w-60"
            placeholder="Search..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="w-20 h-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Searchbar;
