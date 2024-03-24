import express from "express";
import {
  getMovies,
  getAllMovies,
  postMovie,
  deleteMovie,
} from "../controllers/s3.controller.js";
import multer from "multer";
// import protectRoute from "../middleware/protectRoute.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

upload.single("url");

const router = express.Router();
router.get("/get_all_movies/:category", getAllMovies);
router.get("/getmovies", getMovies);
router.post("/movies", upload.single("url"), postMovie);
router.delete("/movies/:id", deleteMovie);

export default router;
