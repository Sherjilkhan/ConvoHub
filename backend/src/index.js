import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth_route.js";
import messageRoutes from "./routes/message_route.js";
import cors from "cors";
import { app, server} from "./lib/socket.js";
import path from "path"
import mongoose from "mongoose";
dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://convohub-one.vercel.app/",
    methods:["POST", "GET"],
    credentials: true,
  })
);

mongoose.connect('mongodb+srv://khansherjil9217:oVcZkRttouSDn0Ff@cluster0.ov52o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.get("/", (req, res)=>{
  res.json("COnvoHub is Running")
})

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV==="production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend", "dist","index.html"))
  });
}

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
