import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";

type Trip = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};
function App() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error logging in:", error.message);
  };
  useEffect(() => {
    fetch("http://localhost:5050/trips")
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((error) => console.error("Error fetching trips:", error));
  }, []);
  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>Travel App</h1>
        <button onClick={handleLogin}>Sign in with Google</button>
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              <h3>{trip.title}</h3>
              <p>{trip.description}</p>
              <p>Start Date: {trip.startDate}</p>
              <p>End Date: {trip.endDate}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
