import { useState } from "react";
import { useEffect } from "react";
import AddTripForm from "./AddTripForm";
import { User } from "@supabase/supabase-js";
import { Button, Table } from "@chakra-ui/react";

type Trip = {
  id: number;
  name: string;
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
    console.log("Fetched trips:", data);
    setTrips(data);
  };
  useEffect(() => {
    fetchTrips();
  }, []);
  const hadleAddingTrip = () => {
    setIsAdding(false);
    fetchTrips();
  };
  return (
    <div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Start Date</Table.ColumnHeader>
            <Table.ColumnHeader>End Date</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {trips.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>{item.startDate}</Table.Cell>
              <Table.Cell textAlign="end">{item.endDate}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Button
        mt={4}
        colorScheme="teal"
        onClick={() => setIsAdding((prev) => !prev)}
      >
        {isAdding ? "Cancel" : "Add Trip"}
      </Button>
      {isAdding && <AddTripForm userId={user.id} onSuccess={hadleAddingTrip} />}
    </div>
  );
}
