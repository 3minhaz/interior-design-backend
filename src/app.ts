import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

app.use(cors());
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
