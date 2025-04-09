import express, { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient";

dotenv.config();

const app: express.Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working!");
});
app.post("/trips", async (req: Request, res: Response): Promise<void> => {
  const { user_id, name, description, start_date, end_date } = req.body;

  if (!user_id || !name) {
    res.status(400).json({ error: "user_id and name are required" });
    return;
  }

  const { data, error } = await supabase
    .from("trips")
    .insert([{ user_id, name, description, start_date, end_date }])
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(data);
  return;
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
