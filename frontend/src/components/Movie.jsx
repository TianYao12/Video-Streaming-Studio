import React, { useState } from "react";
const Movie = ({ item }) => {
  return (
    <div className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2">
      <video width="160px" controls>
        <source
          src="https://d24yp5jzquxd0h.cloudfront.net/Untitled%20design.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

export default Movie;
