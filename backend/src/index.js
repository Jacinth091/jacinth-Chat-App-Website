// const express = require("express");
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./lib/db.js";
import authRoute from "./routes/auth.route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
app.use("/api/auth", authRoute );

app.listen(PORT, () =>{
  console.log("Server is running on PORT:" +PORT);
  connectDB();
});
