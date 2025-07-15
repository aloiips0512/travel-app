import {
  Box,
  Button,
  CloseButton,
  Dialog,
  DialogBackdrop,
  Grid,
  Heading,
  Input,
  Portal,
  Select,
  Separator,
  Stack,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { Trip } from "../models/Trip";
import { useEffect, useState } from "react";
import { Location } from "../models/Location";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { MapPreview } from "./MapPreview";

type TripDetailProps = {
  trip: Trip;
};
export function TripDetail({ trip }: TripDetailProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState<Location | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [types, setTypes] = useState<{
    items: { value: string; label: string }[];
  }>({ items: [] });

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await fetch(
        `http://localhost:5050/locations/trip/${trip.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data = await response.json();
      setLocations(data);
    };
    fetchLocations();
  }, [trip.id]);
  useEffect(() => {
    const fetchLocationTypes = async () => {
      const response = await fetch(`http://localhost:5050/locations/types`);
      if (!response.ok) {
        throw new Error("Failed to fetch location types");
      }
      const data = await response.json();
      const formattedTypes = {
        items: data.map((type: { id: number; name: string }) => ({
          value: type.id,
          label: type.name,
        })),
      };
      setTypes(formattedTypes);
    };
    fetchLocationTypes();
  }, []);

  const handleAddLocation = async (location: Location) => {
    console.log("Adding location:", location);
    const response = await fetch(`http://localhost:5050/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    if (!response.ok) {
      throw new Error("Failed to add location");
    }
    const data = await response.json();
    setLocations((prevLocations) => [...prevLocations, data]);
  };
  const handleEditLocation = async (id: string, name: string) => {
    const response = await fetch(`http://localhost:5050/locations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    });
    if (!response.ok) {
      throw new Error("Failed to update location");
    }
    const updatedLocation = await response.json();
    setLocations((prevLocations) =>
      prevLocations.map((loc) =>
        loc.id === id ? { ...loc, name: updatedLocation.name } : loc
      )
    );
  };
  const handleDeleteLocation = async (locationId: string) => {
    const response = await fetch(
      `http://localhost:5050/locations/${locationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete location");
    }
    setLocations((prevLocations) =>
      prevLocations.filter((loc) => loc.id !== locationId)
    );
  };
  return (
    <>
      <Box py={8}>
        <Heading size="lg">{trip.name}</Heading>
        <Text color="white" mt={1}>
          {trip.description}
        </Text>
        <Separator mb={6} />
        <Grid
          rowGap={4}
          templateColumns={{ base: "1fr", md: "200px 1fr" }}
          columnGap={6}
          alignItems="start"
        >
          <Text fontWeight="semibold" color="white">
            Start Date:
          </Text>
          <Text>{new Date(trip.start_date).toLocaleDateString()}</Text>
          <Text fontWeight="semibold" color="white">
            End Date:
          </Text>
          <Text>{new Date(trip.end_date).toLocaleDateString()}</Text>
          {trip.shared_with?.length > 0 && (
            <>
              <Text fontWeight="semibold" alignSelf="start" color="white">
                Shared With:
              </Text>
              <Stack gap={1}>
                {trip.shared_with.map((email) => (
                  <Text key={email} fontSize="sm" color="white">
                    • {email}
                  </Text>
                ))}
              </Stack>
            </>
          )}{" "}
        </Grid>

        <Box
          mt={8}
          p={5}
          borderRadius="lg"
          background="gray.700"
          boxShadow="md"
          overflowX="auto"
          gap={3}
        >
          <Text
            fontWeight="semibold"
            color="white"
            boxShadow="md"
            alignContent="right"
            mb={4}
          >
            Locations:
          </Text>
          {locations.length > 0 ? (
            <Stack gap={3} mb={6}>
              {locations.map((location) => (
                <Grid
                  rowGap={5}
                  columnGap={6}
                  key={location.id}
                  templateColumns="2fr 1fr auto auto"
                  alignItems="center"
                  gap={3}
                  p={3}
                  borderRadius="md"
                  background="gray.600"
                >
                  <Text
                    key={location.id}
                    fontSize="sm"
                    color="white"
                    lineClamp={1}
                  >
                    • {location.name}
                  </Text>
                  <Text fontSize="sm" color="white" lineClamp={1}>
                    {location.type_name}
                  </Text>
                  <Button
                    size="xs"
                    colorScheme="yellow"
                    onClick={() => {
                      setIsEditOpen(true);
                      setLocationToEdit(location);
                    }}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handleDeleteLocation(location.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </Grid>
              ))}
            </Stack>
          ) : (
            <Text color="white">No locations added yet</Text>
          )}
          <Button
            colorScheme="blue"
            size="xs"
            mb={3}
            onClick={() => {
              setLocationToEdit({
                id: "",
                name: "",
                trip_id: trip.id,
                type_id: 0,
                type_name: "",
                longitude: 0,
                latitude: 0,
              });
              setIsEditOpen(true);
              setIsAddMode(true);
            }}
          >
            + Add Location
          </Button>
          <Button
            colorScheme="blue"
            size="xs"
            mb={3}
            onClick={() => {
              <MapPreview locations={locations} />;
            }}
          >
            Map
          </Button>
        </Box>
      </Box>
      <Dialog.Root
        open={isEditOpen}
        onOpenChange={(e) => setIsEditOpen(e.open)}
      >
        <Portal>
          <DialogBackdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="lg" borderRadius="lg" bg="white">
              <Dialog.Header>
                <Dialog.Title color="black">Edit Location</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" variant="solid" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                {locationToEdit ? (
                  <Stack gap={4}>
                    <Text fontWeight="semibold" color="black">
                      Name:
                    </Text>
                    <Input
                      type="text"
                      value={locationToEdit.name}
                      color="black"
                      onChange={(e) =>
                        setLocationToEdit({
                          ...locationToEdit,
                          name: e.target.value,
                        })
                      }
                    />
                    <Text fontWeight="semibold" color="black">
                      Type:
                    </Text>
                    <Select.Root
                      collection={createListCollection({
                        items: [
                          { value: "1", label: "Sight" },
                          { value: "2", label: "Walk" },
                        ],
                      })}
                      size="sm"
                      width="320px"
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger backgroundColor="transparent">
                          <Select.ValueText
                            placeholder="Select type"
                            colorPalette="gray"
                          />
                        </Select.Trigger>
                        <Select.IndicatorGroup colorPalette="gray">
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content colorPalette="black" bg="white">
                            {types.items.map((type) => (
                              <Select.Item
                                item={type}
                                key={type.value}
                                colorPalette="black"
                              >
                                {type.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>{" "}
                  </Stack>
                ) : (
                  <Text color="black">No location selected for editing</Text>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  colorPalette="white"
                  variant="solid"
                  onClick={() => {
                    if (!locationToEdit) return;
                    if (isAddMode) {
                      handleAddLocation(locationToEdit);
                    } else {
                      handleEditLocation(
                        locationToEdit.id,
                        locationToEdit.name
                      );
                    }
                    setLocationToEdit(null);
                    setIsAddMode(false);
                    setIsEditOpen(false);
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="solid"
                  colorPalette="white"
                  onClick={() => {
                    setIsEditOpen(false);
                    setLocationToEdit(null);
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
