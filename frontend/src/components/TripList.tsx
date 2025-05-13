import { useState } from "react";
import { useEffect } from "react";
import AddTripForm from "./AddTripForm";
import { User } from "@supabase/supabase-js";
import { Button, IconButton, Input, Table } from "@chakra-ui/react";
import { PencilIcon, Trash2Icon, Save, CircleX } from "lucide-react";

type Trip = {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
};
type TripListProps = { user: User };

export function TripList({ user }: TripListProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<Partial<Trip> | null>(null);

  const fetchTrips = async () => {
    const response = await fetch("http://localhost:5050/trips");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Fetched trips:", data);
    setTrips(data);
  };
  const handleSave = async () => {
    await fetch(`http://localhost:5050/trips/${editingTripId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingTrip),
    });
    setEditingTripId(null);
    fetchTrips();
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
              <Table.Cell color="black">
                {editingTripId === item.id ? (
                  <Input
                    value={editingTrip?.name ?? ""}
                    onChange={(e) =>
                      setEditingTrip({ ...editingTrip, name: e.target.value })
                    }
                  ></Input>
                ) : (
                  item.name
                )}
              </Table.Cell>
              <Table.Cell color="black">
                {editingTripId === item.id ? (
                  <Input
                    value={editingTrip?.description ?? ""}
                    onChange={(e) =>
                      setEditingTrip({
                        ...editingTrip!,
                        description: e.target.value,
                      })
                    }
                  ></Input>
                ) : (
                  item.description
                )}
              </Table.Cell>
              <Table.Cell color="black">
                {editingTripId === item.id ? (
                  <Input
                    value={editingTrip?.start_date ?? ""}
                    onChange={(e) =>
                      setEditingTrip({
                        ...editingTrip!,
                        start_date: e.target.value,
                      })
                    }
                  ></Input>
                ) : (
                  item.start_date
                )}
              </Table.Cell>
              <Table.Cell color="black" textAlign="end">
                {editingTripId == item.id ? (
                  <Input
                    value={editingTrip?.end_date ?? ""}
                    onChange={(e) =>
                      setEditingTrip({
                        ...editingTrip!,
                        end_date: e.target.value,
                      })
                    }
                  ></Input>
                ) : (
                  item.end_date
                )}
              </Table.Cell>
              <Table.Cell color="white" textAlign="right">
                {editingTripId == item.id ? (
                  <>
                    <IconButton
                      aria-label="Save"
                      variant="outline"
                      backgroundColor="white"
                      colorScheme="blue"
                      size="sm"
                      onClick={handleSave}
                    >
                      <Save />
                    </IconButton>
                    <IconButton
                      aria-label="Cancel"
                      variant="outline"
                      colorScheme="red"
                      backgroundColor="white"
                      size="sm"
                      onClick={() => {
                        setEditingTripId(null);
                        setEditingTrip(null);
                      }}
                    >
                      <CircleX />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      aria-label="Edit"
                      variant="outline"
                      colorScheme="blue"
                      backgroundColor="white"
                      size="sm"
                      onClick={() => {
                        setEditingTripId(item.id);
                        setEditingTrip(item);
                      }}
                    >
                      <PencilIcon />
                    </IconButton>

                    <IconButton
                      aria-label="Delete"
                      variant="outline"
                      colorScheme="red"
                      backgroundColor="white"
                      size="sm"
                      onClick={async () => {
                        const res = await fetch(
                          `http://localhost:5050/trips/${item.id}`,
                          {
                            method: "DELETE",
                          }
                        );
                        if (res.status != 204) {
                          console.error("Failed to delete trip");
                          return;
                        }
                        fetchTrips();
                      }}
                    >
                      <Trash2Icon />
                    </IconButton>
                  </>
                )}
              </Table.Cell>
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
