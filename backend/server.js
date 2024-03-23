import express from "express";
import connectToMongoDB from "./db/connectToMongoDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; 

import authRoutes from "./routes/auth.routes.js";
import s3Routes from "./routes/s3.routes.js"

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;

app.use(express.json()); // from req.body to parse with JSON payloads
app.use(cookieParser()); // to parse incoming cookies from req.cookies
app.use(cors());

app.use("/api/auth", authRoutes);
app.use('/s3', s3Routes)

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
