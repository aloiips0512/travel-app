import "maplibre-gl/dist/maplibre-gl.css";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import { Location } from "../models/Location";
import { useState } from "react";

type MapPreviewProps = {
  locations: Location[];
};

export const MapPreview = ({ locations }: MapPreviewProps) => {
  const center = locations.length
    ? { longitude: locations[0].longitude, latitude: locations[0].latitude }
    : { longitude: 0, latitude: 0 };
  const [selected, setSelected] = useState<Location | null>(null);

  return (
    <Map
      initialViewState={{
        longitude: center.longitude,
        latitude: center.latitude,
        zoom: 5,
      }}
      style={{
        width: "100%",
        height: "300px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${
        import.meta.env.VITE_MAPTILER_API_KEY
      }`}
    >
      {locations.map((loc) => (
        <Marker key={loc.id} longitude={loc.longitude} latitude={loc.latitude}>
          <button
            onClick={() => setSelected(loc)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            📍
          </button>
        </Marker>
      ))}
      {selected && (
        <Popup
          longitude={selected.longitude}
          latitude={selected.latitude}
          onClose={() => setSelected(null)}
        >
          <div>{selected.name}</div>
        </Popup>
      )}
    </Map>
  );
};
