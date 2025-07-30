import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  DialogBackdrop,
  Portal,
  Text,
} from "@chakra-ui/react";
import { Location } from "../models/Location";

const INITIAL_CENTER: [number, number] = [-74.0242, 40.6941];
const INITIAL_ZOOM = 10.12;
const mapboxToTypeName: Record<string, string> = {
  poi: "Sight",
  address: "Walk",
  place: "Sight",
  locality: "Walk",
  region: "Region",
  default: "Sight",
};

type TripMapProps = {
  tripId: string;
  onLocationAdded?: () => void;
  locations?: Location[];
};
export function TripMap({ tripId, onLocationAdded, locations }: TripMapProps) {
  const mapRef = useRef(null as mapboxgl.Map | null);
  const mapContainerRef = useRef(null as HTMLDivElement | null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [locationTypes, setLocationTypes] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lng: number;
    lat: number;
    typeId: number;
    typeName?: string;
  } | null>(null);
  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  useEffect(() => {
    const fetchLocationTypes = async () => {
      console.log("Fetching from backend...");
      const response = await fetch(`http://localhost:5050/locations/types`);
      if (!response.ok) {
        throw new Error("Failed to fetch location types");
      }
      const data = await response.json();

      setLocationTypes(data);
    };
    fetchLocationTypes();
  }, []);

  useEffect(() => {
    if (!mapRef.current || locationTypes.length === 0 || geocoderRef.current)
      return;

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as unknown as typeof import("mapbox-gl"),
      marker: false,
    });
    geocoderRef.current = geocoder;
    mapRef.current.addControl(geocoder);

    geocoder.on("result", (e) => {
      try {
        const coords = e.result.geometry.coordinates as [number, number];
        const name = e.result.place_name;
        const type = e.result.place_type?.[0] || "default";
        const typeName = mapboxToTypeName[type] || mapboxToTypeName.default;

        const matchedType = locationTypes.find((t) => t.name === typeName);
        if (!matchedType) {
          console.warn("No matching location type found for:", typeName);
          return;
        }
        setSelectedLocation({
          name: name,
          lng: coords[0],
          lat: coords[1],
          typeId: matchedType.id,
          typeName: matchedType.name,
        });
        new mapboxgl.Marker().setLngLat(coords).addTo(mapRef.current!);
      } catch (err) {
        console.error("Error in geocoder result handler:", err);
      }
    });
  }, [locationTypes]);

  useEffect(() => {
    if (!mapRef.current || !locations || locations.length === 0) return;

    locations.forEach((location) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);

      marker.getElement().addEventListener("click", () => {
        setSelectedLocation({
          name: location.name,
          lng: location.longitude,
          lat: location.latitude,
          typeId: location.type_id,
          typeName: location.type_name,
        });
      });
    });

    const firstLocation = locations[0];
    const newCenter: [number, number] = [
      firstLocation.longitude,
      firstLocation.latitude,
    ];

    mapRef.current!.setCenter(newCenter);
    mapRef.current!.setZoom(zoom);

    setCenter(newCenter);
    setZoom(INITIAL_ZOOM);
  }, [locations, center, zoom]);

  useLayoutEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

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

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <>
      <Dialog.Root
        open={!!selectedLocation}
        onOpenChange={(e) => {
          if (!e.open) setSelectedLocation(null);
        }}
      >
        <Portal>
          <DialogBackdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="white" borderRadius="lg" maxW="lg">
              <Dialog.Header>
                <Dialog.Title color="black">Add Location to Trip</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" colorPalette="white" variant="solid" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="black" mb={2}>
                  Do you want to add <strong>{selectedLocation?.name}</strong>{" "}
                  as a <strong>{selectedLocation?.typeName}</strong> to this
                  trip?
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  onClick={() => setSelectedLocation(null)}
                  colorPalette="white"
                  variant="solid"
                >
                  Cancel
                </Button>
                <Button
                  colorPalette="white"
                  variant="solid"
                  ml={3}
                  onClick={async () => {
                    if (!selectedLocation) return;
                    const response = await fetch(
                      "http://localhost:5050/locations",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: selectedLocation.name,
                          trip_id: tripId,
                          type_id: selectedLocation.typeId,
                          longitude: selectedLocation.lng,
                          latitude: selectedLocation.lat,
                        }),
                      }
                    );

                    if (response.ok) {
                      new mapboxgl.Marker()
                        .setLngLat([selectedLocation.lng, selectedLocation.lat])
                        .addTo(mapRef.current!);
                      onLocationAdded?.();
                    }

                    setSelectedLocation(null);
                  }}
                >
                  Add
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <div id="map-container" ref={mapContainerRef}></div>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude:{center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
    </>
  );
}
