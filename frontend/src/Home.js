import React from "react";
import Carousel from "./components/Carousel";
import Main from "./components/Main";
import Searchbar from "./components/Searchbar"

const Home = () => {
  return (
    <>
      <Main />
      <Searchbar />
      <Carousel rowID="1" category="Trending" />
      <Carousel rowID="2" category="Recently Watched" />
      <Carousel rowID="3" category="Horror" />
    </>
  );
};

export default Home;
