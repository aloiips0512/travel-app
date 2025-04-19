import { Router } from "express";
import { supabase } from "../supabaseClient";

const router = Router();

type Trip = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

let trips: Trip[] = [
  {
    title: "Trip to Paris",
    description: "A week-long trip to explore the beauty of Paris.",
    startDate: "2023-06-01",
    endDate: "2023-06-08",
  },
  {
    title: "Beach Vacation",
    description: "Relaxing vacation at the beach.",
    startDate: "2023-07-15",
    endDate: "2023-07-22",
  },
  {
    title: "Mountain Hiking",
    description: "An adventurous hiking trip in the mountains.",
    startDate: "2023-08-10",
    endDate: "2023-08-15",
  },
];

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("trips").select("*");
  if (data !== null) {
    res.json(data);
  }
  if (error) {
    res.status(500).json({ error: "Error fetching trips from database" });
  }
  res.json(trips);
});
router.post("/", async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  const { data, error } = await supabase
    .from("trips")
    .insert([{ title, description, startDate, endDate }])
    .select();
  if (error) {
    res.status(500).json({ error: "Error inserting trip into database" });
  }
  if (data) {
    res.status(201).json(data[0]);
  }
});
export default router;
