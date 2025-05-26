import { Button, Center, Link, Spinner } from "@chakra-ui/react";
import { TripDetail } from "../components/TripDetail";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Trip } from "../models/Trip";

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      const response = await fetch(`http://localhost:5050/trips/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch trip");
      }
      const data = await response.json();
      setTrip(data);
      setLoading(false);
    };
    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!trip) {
    return (
      <Center>
        <p>Trip not found</p>
      </Center>
    );
  }
  return (
    <>
      <Link href="/">
        <Button variant="ghost" mb={4}>
          ← Back to Trips
        </Button>
      </Link>
      <TripDetail trip={trip} />;
    </>
  );
}
