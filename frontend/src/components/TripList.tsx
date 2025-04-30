import { useState } from "react";
import { useEffect } from "react";
import AddTripForm from "./AddTripForm";
import { User } from "@supabase/supabase-js";

type Trip = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};
type TripListProps = { user: User };

export function TripList({ user }: TripListProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const fetchTrips = async () => {
    const response = await fetch("http://localhost:5050/trips");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setTrips(data);
  };
  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div>
      <h2>Trip List</h2>
      {isAdding ? (
        <AddTripForm userId={user.id} />
      ) : (
        <button onClick={() => setIsAdding(true)}>add trip</button>
      )}
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
  );
}
