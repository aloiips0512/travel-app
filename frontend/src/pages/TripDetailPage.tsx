import { Button, Center, Flex, Spinner, Box } from "@chakra-ui/react";
import { TripDetail } from "../components/TripDetail";
import { useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Trip } from "../models/Trip";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null as mapboxgl.Map | null);
  const mapContainerRef = useRef(null as HTMLDivElement | null);

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

  useLayoutEffect(() => {
    if (!mapContainerRef.current || mapRef.current || loading) return;

    mapboxgl.accessToken = `${import.meta.env.VITE_MAPTILER_API_KEY}`;
    console.log(import.meta.env.VITE_MAPTILER_API_KEY);
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.0242, 40.6941],
      zoom: 10.12,
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [loading]);

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
    <Flex direction="column" height="100vh">
      <Box p={2}>
        <Button
          variant="outline"
          mb={4}
          size="lg"
          color="white"
          colorScheme="teal"
          asChild
        >
          <a href="/"> ← Back to Trips</a>
        </Button>
        <TripDetail trip={trip} />
      </Box>
      <Box flex="1">
        <div id="map-container" ref={mapContainerRef} />
      </Box>
    </Flex>
  );
}
