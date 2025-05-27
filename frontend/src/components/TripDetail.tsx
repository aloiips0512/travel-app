import { Box, Grid, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { Trip } from "../models/Trip";
import { useEffect, useState } from "react";
import { Location } from "../models/Location";

type TripDetailProps = {
  trip: Trip;
};
export function TripDetail({ trip }: TripDetailProps) {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await fetch(
        `http://localhost:5050/trips/${trip.id}/locations`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data = await response.json();
      setLocations(data);
    };
    fetchLocations();
  }, [trip.id]);

  return (
    <Box py={4}>
      <Heading size="lg">{trip.name}</Heading>
      <Text color="gray.600" mt={1}>
        {trip.description}
      </Text>
      <Separator mb={6} />
      <Grid
        rowGap={4}
        templateColumns={{ base: "1fr", md: "200px 1fr" }}
        columnGap={6}
        alignItems="start"
      >
        <Text fontWeight="semibold" color="gray.700">
          Start Date:
        </Text>
        <Text>{new Date(trip.start_date).toLocaleDateString()}</Text>

        <Text fontWeight="semibold" color="gray.700">
          End Date:
        </Text>
        <Text>{new Date(trip.end_date).toLocaleDateString()}</Text>

        {trip.shared_with?.length > 0 && (
          <>
            <Text fontWeight="semibold" alignSelf="start" color="gray.700">
              Shared With:
            </Text>
            <Stack gap={1}>
              {trip.shared_with.map((email) => (
                <Text key={email} fontSize="sm" color="gray.700">
                  • {email}
                </Text>
              ))}
            </Stack>
          </>
        )}
        <Text fontWeight="semibold" color="gray.700">
          Locations:
        </Text>
        <Stack gap={2}>
          {locations.length > 0 ? (
            locations.map((location) => (
              <Text key={location.id} fontSize="sm" color="gray.700">
                • {location.name}
              </Text>
            ))
          ) : (
            <Text color="gray.500">No locations added yet</Text>
          )}
        </Stack>
      </Grid>
    </Box>
  );
}
