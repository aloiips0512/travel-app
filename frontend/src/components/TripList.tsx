import { useState } from "react";
import { useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  Table,
} from "@chakra-ui/react";
import { PencilIcon, Trash2Icon, Save, CircleX } from "lucide-react";

type Trip = {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
};

export function TripList() {
  const [trips, setTrips] = useState<Trip[]>([]);
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
  // const hadleAddingTrip = () => {
  //   setIsAdding(false);
  //   fetchTrips();
  // };

  return (
    <Container maxW="container.lg" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">My Trips</Heading>
      </Flex>

      <Box bg="white" borderRadius="lg" boxShadow="md" p={4} overflowX="auto">
        <Table.Root size="sm">
          <Table.Header bg="gray.50">
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Description</Table.ColumnHeader>
              <Table.ColumnHeader>Start Date</Table.ColumnHeader>
              <Table.ColumnHeader>End Date</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {trips.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell color="black">
                  {editingTripId === item.id ? (
                    <Input
                      size="sm"
                      value={editingTrip?.name ?? ""}
                      onChange={(e) =>
                        setEditingTrip({
                          ...editingTrip!,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.name
                  )}
                </Table.Cell>
                <Table.Cell color="black">
                  {editingTripId === item.id ? (
                    <Input
                      size="sm"
                      value={editingTrip?.description ?? ""}
                      onChange={(e) =>
                        setEditingTrip({
                          ...editingTrip!,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.description
                  )}
                </Table.Cell>
                <Table.Cell color="black">
                  {editingTripId === item.id ? (
                    <Input
                      size="sm"
                      value={editingTrip?.start_date ?? ""}
                      onChange={(e) =>
                        setEditingTrip({
                          ...editingTrip!,
                          start_date: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.start_date
                  )}
                </Table.Cell>
                <Table.Cell color="black">
                  {editingTripId === item.id ? (
                    <Input
                      size="sm"
                      value={editingTrip?.end_date ?? ""}
                      onChange={(e) =>
                        setEditingTrip({
                          ...editingTrip!,
                          end_date: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.end_date
                  )}
                </Table.Cell>
                <Table.Cell color="black" textAlign="right">
                  {editingTripId === item.id ? (
                    <Flex gap={2} justify="flex-end">
                      <IconButton
                        aria-label="Save"
                        size="sm"
                        colorScheme="blue"
                        onClick={handleSave}
                      >
                        <Save />
                      </IconButton>
                      <IconButton
                        aria-label="Cancel"
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          setEditingTripId(null);
                          setEditingTrip(null);
                        }}
                      >
                        <CircleX />
                      </IconButton>
                    </Flex>
                  ) : (
                    <Flex gap={2} justify="flex-end">
                      <IconButton
                        aria-label="Edit"
                        size="sm"
                        colorScheme="blue"
                        onClick={() => {
                          setEditingTripId(item.id);
                          setEditingTrip(item);
                        }}
                      >
                        <PencilIcon />
                      </IconButton>
                      <IconButton
                        aria-label="Delete"
                        size="sm"
                        colorScheme="red"
                        onClick={async () => {
                          const res = await fetch(
                            `http://localhost:5050/trips/${item.id}`,
                            {
                              method: "DELETE",
                            }
                          );
                          if (res.status !== 204) {
                            console.error("Failed to delete trip");
                            return;
                          }
                          fetchTrips();
                        }}
                      >
                        <Trash2Icon />
                      </IconButton>
                    </Flex>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Container>
  );
}
