import { Router } from "express";
import { supabase } from "../supabaseClient";

const router = Router();

type Trip = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  shared_with?: string[];
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
  const { search } = req.query;
  const query = supabase.from("trips").select("*");
  if (search && typeof search === "string") {
    query.ilike("name", `%${search}%`);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Error fetching trips from database" });
    return;
  }
  res.json(data);
});
router.get("/test-supabase", async (req, res) => {
  const { data, error } = await supabase.from("trips").select("*").limit(1);

  if (error) {
    console.error("Supabase test error:", error);
    res.status(500).json({ error: "Supabase connection failed" });
  }

  res.json({ testSuccess: true, data });
});

router.post("/", async (req, res) => {
  const { title, description, startDate, endDate, userId } = req.body;
  const { data, error } = await supabase
    .from("trips")
    .insert({
      name: title,
      description,
      start_date: startDate,
      end_date: endDate,
      user_id: userId,
    })
    .select("*");
  if (error) {
    console.error("Error inserting trip:", error);
    res.status(500).json({ error: "Error inserting trip into database" });
    return;
  }
  if (data) {
    res.status(201).json(data[0]);
    return;
  }
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, shared_with } = req.body;
  const { data, error } = await supabase
    .from("trips")
    .update({
      name: title,
      description,
      start_date: startDate,
      end_date: endDate,
      shared_with: shared_with,
    })
    .eq("id", id)
    .select("*");
  if (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ error: "Error updating trip in database" });
    return;
  }
  res.json(data[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("trips")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    res.status(500).json({ error: "Error deleting trip from database" });
    return;
  }
  if (!data || data.length === 0) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }
  res.status(204).send();
});

export default router;
