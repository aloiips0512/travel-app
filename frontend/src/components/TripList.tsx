import { useState } from "react";
import { useEffect } from "react";
import {
  Box,
  Button,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Input,
  Link,
  Portal,
  Table,
  Text,
} from "@chakra-ui/react";
import { PencilIcon, Trash2Icon, Save, CircleX, Share2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Trip } from "../models/Trip";

type TripListProps = {
  user?: User | null;
};

export function TripList({ user }: TripListProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<Partial<Trip> | null>(null);
  const [isOpenShareModal, setIsOpenShareModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [emailToShare, setEmailToShare] = useState("");
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [emailToUnshare, setEmailToUnshare] = useState<string | null>(null);

  const openShareModal = (trip: Trip) => {
    setIsOpenShareModal(true);
    setSelectedTrip(trip);
  };
  const closeShareModal = () => {
    setIsOpenShareModal(false);
    setSelectedTrip(null);
  };
  const fetchTrips = async () => {
    const response = await fetch("http://localhost:5050/trips");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
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

  const myTrips = trips.filter((trip) => trip.user_id === user?.id);
  const sharedTrips = trips.filter((trip) =>
    trip.shared_with?.includes(user?.email || "")
  );
  const handleShare = async (trip: Trip, email: string) => {
    console.log("Sharing trip:", trip, "with email:", email);
    if (!email.trim()) {
      console.error("Email is empty");
      return;
    }
    const currentEmails = trip.shared_with || [];
    if (currentEmails.includes(email)) {
      console.error("Trip already shared with this email");
      return;
    }
    const updatedEmails = [...currentEmails, email];
    const response = await fetch(`http://localhost:5050/trips/${trip.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shared_with: updatedEmails }),
    });
    if (!response.ok) {
      console.error("Failed to share trip");
      return;
    }
    fetchTrips();
  };
  const handleUnshare = async (trip: Trip, email: string) => {
    const currentEmails = trip.shared_with || [];
    const updatedEmails = currentEmails.filter((e) => e !== email);
    const response = await fetch(`http://localhost:5050/trips/${trip.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shared_with: updatedEmails }),
    });
    if (!response.ok) {
      console.error("Failed to unshare trip");
      return;
    }
    fetchTrips();
  };
  return (
    <>
      <Container maxW="container.lg" py={8}>
        {myTrips.length > 0 && (
          <>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="lg">My Trips</Heading>
            </Flex>
            <Box
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              p={4}
              overflowX="auto"
            >
              <Table.Root size="sm" interactive>
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Description</Table.ColumnHeader>
                    <Table.ColumnHeader>Start Date</Table.ColumnHeader>
                    <Table.ColumnHeader>End Date</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">
                      Actions
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {myTrips.map((item) => (
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
                          <Link href={`/trips/${item.id}`}>
                            <Text colorPalette="gray">{item.name}</Text>
                          </Link>
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
                            <IconButton
                              aria-label="Share"
                              size="sm"
                              colorScheme="blue"
                              onClick={() => openShareModal(item)}
                            >
                              <Share2 />
                            </IconButton>
                          </Flex>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </>
        )}

        {sharedTrips.length > 0 && (
          <>
            <Heading size="lg" mt={8} mb={4}>
              Shared Trips
            </Heading>
            <Box
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              p={4}
              overflowX="auto"
            >
              <Table.Root size="sm">
                <Table.Header bg="gray.50">
                  <Table.Row>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Description</Table.ColumnHeader>
                    <Table.ColumnHeader>Start Date</Table.ColumnHeader>
                    <Table.ColumnHeader>End Date</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sharedTrips.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell color="black">{item.name}</Table.Cell>
                      <Table.Cell color="black">{item.description}</Table.Cell>
                      <Table.Cell color="black">{item.start_date}</Table.Cell>
                      <Table.Cell color="black">{item.end_date}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </>
        )}
        <Dialog.Root
          open={isOpenShareModal}
          onOpenChange={(details) => setIsOpenShareModal(details.open)}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Share Trip</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                  <Input
                    placeholder="Enter email"
                    value={emailToShare}
                    onChange={(e) => setEmailToShare(e.target.value)}
                    mt={2}
                    color="black"
                  />
                  {(selectedTrip?.shared_with ?? []).length > 0 && (
                    <Box mb={3}>
                      <Heading size="sm" mt={4} mb={2}>
                        Already Shared With:
                      </Heading>
                      <Box pl={2}>
                        {selectedTrip?.shared_with?.map((email) => (
                          <Flex gap="4">
                            <Box
                              key={email}
                              mt={2}
                              fontSize="md"
                              color="gray.600"
                            >
                              * {email}
                            </Box>
                            <CloseButton
                              size="2xs"
                              variant="solid"
                              colorScheme="red"
                              onClick={() => {
                                setEmailToUnshare(email);
                                setIsAlertDialogOpen(true);
                              }}
                            />
                          </Flex>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Dialog.Body>

                <Dialog.Footer>
                  <Button
                    onClick={() => {
                      setEmailToShare("");
                    }}
                    colorScheme="blue"
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      if (selectedTrip && emailToShare) {
                        handleShare(selectedTrip, emailToShare);
                        setEmailToShare("");
                        setIsOpenShareModal(false);
                      }
                    }}
                  >
                    Share
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton
                    size="sm"
                    variant="solid"
                    colorPalette="red"
                    onClick={closeShareModal}
                  />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
        <Dialog.Root
          open={isAlertDialogOpen}
          onOpenChange={(details) => {
            setIsAlertDialogOpen(details.open);
            if (!details.open) {
              setEmailToUnshare(null);
            }
          }}
          role="alertdialog"
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Unshare Email</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p style={{ color: "black" }}>
                    Are you sure you want to unshare this trip with{" "}
                    <strong>{emailToUnshare}</strong> ?
                  </p>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="solid">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button
                    colorPalette="red"
                    variant="solid"
                    onClick={() => {
                      if (selectedTrip && emailToUnshare) {
                        handleUnshare(selectedTrip, emailToUnshare);
                        setEmailToUnshare(null);
                        setSelectedTrip(null);
                        setIsAlertDialogOpen(false);
                      }
                    }}
                  >
                    Unshare
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Container>
    </>
  );
}
