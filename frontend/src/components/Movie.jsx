import React from "react";
const Movie = ({ item }) => {
  return (
    <div className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2">
      <video width="150px" controls>
        <source src={item} type="video/mp4" />
      </video>
    </div>
  );
};

export default Movie;
