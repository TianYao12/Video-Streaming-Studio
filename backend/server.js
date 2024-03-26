import express from "express";
import connectToMongoDB from "./db/connectToMongoDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import s3Routes from "./routes/s3.routes.js";
import search from "./controllers/search.controller.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;

app.use(express.json()); // from req.body to parse with JSON payloads
app.use(cookieParser()); // to parse incoming cookies from req.cookies

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/s3", s3Routes);
app.get("/search", search);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
