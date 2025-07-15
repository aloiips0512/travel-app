import { Router } from "express";
import { supabase } from "../supabaseClient";

const router = Router();
type Location = {
  id: string;
  name: string;
  type: string;
  trip_id: string;
  longitude: number;
  latitude: number;
};

router.get("/trip/:tripId", async (req, res) => {
  const { tripId } = req.params;
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("trip_id", tripId);
  if (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Error fetching locations from database" });
    return;
  }
  res.json(data);
});
router.get("/types", async (req, res) => {
  const { data, error } = await supabase.from("location_types").select();
  if (error) {
    console.error("Error fetching location types:", error);
    res
      .status(500)
      .json({ error: "Error fetching location types from database" });
    return;
  }
  const types = data.map((item) => ({
    id: item.id,
    name: item.name,
  }));
  console.log("Location types:", types);
  res.json(types);
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, type, latitude, longitude } = req.body;

  const { data, error } = await supabase
    .from("locations")
    .update({ name, description, type, latitude, longitude })
    .eq("id", id)
    .select("*");

  if (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Error updating location in database" });
    return;
  }
  if (!data || data.length === 0) {
    res.status(404).json({ error: "Location not found" });
    return;
  }
  res.json(data[0]);
});
router.post("/", async (req, res) => {
  const { name, description, type, latitude, longitude, trip_id } = req.body;
  console.log("Inserting location:", req.body);

  const { data, error } = await supabase
    .from("locations")
    .insert({ name, description, type, latitude, longitude, trip_id: trip_id })
    .select("*");
  console.log("Inserting location:", req.body);
  if (error) {
    console.error("Error inserting location:", error);
    res.status(500).json({ error: "Error inserting location into database" });
    return;
  }
  res.status(201).json(data[0]);
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("locations")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: "Error deleting location from database" });
    return;
  }
  if (!data || data.length === 0) {
    res.status(404).json({ error: "Location not found" });
    return;
  }
  res.json(data[0]);
});

export default router;
