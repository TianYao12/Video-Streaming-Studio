import Movie from "../models/movie.model.js";

const search = async (req, res) => {
  try {
    const { query } = req.query; 
  } catch (error) {
    console.log("error in search controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default search;
