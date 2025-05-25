import { Trip } from "../models/Trip";

type TripDetailProps = {
  trip: Trip;
};
export function TripDetail({ trip }: TripDetailProps) {
  return (
    <div className="trip-detail">
      <h2>{trip.name}</h2>
      <p>{trip.description}</p>
      <p>
        Start Date: {new Date(trip.start_date).toLocaleDateString()} - End Date:{" "}
        {new Date(trip.end_date).toLocaleDateString()}
      </p>
      <p>Shared with: {trip.shared_with.join(", ")}</p>
    </div>
  );
}
