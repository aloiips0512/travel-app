type Trip = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};
type TripListProps = {
  trips: Trip[];
};
export function TripList({ trips }: TripListProps) {
  return (
    <div>
      <h2>Trip List</h2>
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
