import express, { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient";
import tripRouter from "./routes/trips";

dotenv.config();

const app: express.Application = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working!");
});
app.use("/trips", tripRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
