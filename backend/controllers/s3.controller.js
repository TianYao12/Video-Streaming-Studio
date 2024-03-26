import Movie from "../models/movie.model.js";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
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
    const user = req.query.createdBy;
    const m_movies = await Movie.find({ createdBy: user });
    const movies = m_movies.map((movie) => movie.toObject());
    for (const movie of movies) {
      movie.full_url = "https://dbgl7a08kprxr.cloudfront.net/" + movie.url;
      // code for S3 - not needed for cloudfront
      // const getObjectParams = {
      //   Bucket: bucketName,
      //   Key: movie.url,
      // };
      // const command = new GetObjectCommand(getObjectParams);
      // const full_url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      // movie.full_url = full_url;
    }
    res.send(movies);
  } catch (error) {
    console.error("Error in s3.controller.js getMovies: ", error.message);
    res
      .status(500)
      .json({ error: "Internal server error in s3.controller.js getmovies" });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(category);
    const m_movies = await Movie.find({ category });
    const movies = m_movies.map((movie) => movie.toObject());
    for (const movie of movies) {
      // const getObjectParams = {
      //   Bucket: bucketName,
      //   Key: movie.url,
      // };
      // const command = new GetObjectCommand(getObjectParams);
      // const full_url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      // movie.full_url = full_url;
      movie.full_url = "https://dbgl7a08kprxr.cloudfront.net/" + movie.url;
    }
    res.json(movies);
  } catch (error) {
    console.error("Error in s3.controller.js getAllMovies: ", error.message);
    res.status(500).json({
      error: "Internal server error in s3.controller.js getallmovies",
    });
  }
};

export const postMovie = async (req, res) => {
  try {
    const { title, createdBy, description, category } = req.body;
    console.log("req.body", req.body);
    console.log("req.file", req.file);

    req.file.buffer;

    // save to S3 - we do this even though we are using cloudfront to get
    const videoName = randomVideoName();
    const params = {
      Bucket: bucketName,
      Key: videoName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // save movie info in Movie collection
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
    const id = req.params.id;
    const movie = await Movie.find({ _id: id });
    if (!movie) {
      res.status(404).send("Movie not found");
      return;
    }

    const params = {
      Bucket: bucketName,
      Key: movie[0].url,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    await Movie.deleteOne({ _id: id });
  } catch (error) {
    console.error("Error in s3.controller.js deletemovie: ", error.message);
    res
      .status(500)
      .json({ error: "Internal server error in s3.controller.js" });
  }
};
