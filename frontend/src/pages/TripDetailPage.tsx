import { Button, Center, Flex, Spinner, Box } from "@chakra-ui/react";
import { TripDetail } from "../components/TripDetail";
import { useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Trip } from "../models/Trip";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const INITIAL_CENTER: [number, number] = [-74.0242, 40.6941];
const INITIAL_ZOOM = 10.12;

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null as mapboxgl.Map | null);
  const mapContainerRef = useRef(null as HTMLDivElement | null);

  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

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

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: zoom,
      attributionControl: false,
    });

    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current!.getCenter();
      const mapZoom = mapRef.current!.getZoom();

      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });
    mapRef.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl as unknown as typeof import("mapbox-gl"),
      })
    );

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
  const handleResetButton = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      essential: true, // this ensures the animation is not interrupted
    });
  };

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
      <Box position="relative" height="100%" width="100%">
        <div> </div>
        <div id="map-container" ref={mapContainerRef}></div>
        <div className="sidebar">
          Longitude: {center[0].toFixed(4)} | Latitude:{center[1].toFixed(4)} |
          Zoom: {zoom.toFixed(2)}
        </div>
        <button className="reset-button" onClick={handleResetButton}>
          Reset
        </button>
      </Box>
    </Flex>
  );
}
