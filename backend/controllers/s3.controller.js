import Movie from "../models/movie.model.js";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const randomVideoName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

export const getMovies = async (req, res) => {
  try {
    const { username } = req.query;
    const movies = await Movie.find({ createdBy: username });
    for (const movie of movies) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: movie.url,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      movie.videoUrl = url;
    }

    console.log(movies);

    res.send(movies);
  } catch (error) {
    console.error("Error in s3.controller.js getMovies: ", error.message);
    res
      .status(500)
      .json({ error: "Internal server error in s3.controller.js getmovies" });
  }
};

export const postMovie = async (req, res) => {
  try {
    const { title, createdBy, description, category } = req.body;
    console.log("req.body", req.body);
    console.log("req.file", req.file);

    req.file.buffer;

    const videoName = randomVideoName();
    const params = {
      Bucket: bucketName,
      Key: videoName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const newMovie = new Movie({
      title,
      createdBy,
      description,
      category,
      url: videoName,
    });
    await newMovie.save();
    res.send(newMovie);
  } catch (error) {
    console.error("Error in s3.controller.js postMovie: ", error.message);
    res
      .status(500)
      .json({ error: "Internal server error in s3.controller.js" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error in s3.controller.js deletemovie: ", error.message);
    res
      .status(500)
      .json({ error: "Internal server error in s3.controller.js" });
  }
};
