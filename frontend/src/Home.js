import React from "react";
import Carousel from "./components/Carousel";
import Main from "./components/Main";

const Home = () => {
  return (
    <>
      <Main />
      <Carousel rowID="1" title="Trending" fetchURL={"Trending"} />
      <Carousel
        rowID="2"
        title="Recently Watched"
        fetchURL={"Recently Watched"}
      />
      <Carousel rowID="3" title="Horror" fetchURL={"Horror"} />
    </>
  );
};

export default Home;
