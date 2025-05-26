import { Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { Trip } from "../models/Trip";

type TripDetailProps = {
  trip: Trip;
};
export function TripDetail({ trip }: TripDetailProps) {
  return (
    <Grid gap={4} templateColumns="1fr 2fr">
      <GridItem colSpan={2}>
        <Heading size="lg">{trip.name}</Heading>
        <Text color="gray.600" mt={1}>
          {trip.description}
        </Text>
      </GridItem>

      <Text fontWeight="bold">Start Date:</Text>
      <Text>{new Date(trip.start_date).toLocaleDateString()}</Text>

      <Text fontWeight="bold">End Date:</Text>
      <Text>{new Date(trip.end_date).toLocaleDateString()}</Text>

      {trip.shared_with?.length > 0 && (
        <>
          <Text fontWeight="bold" alignSelf="start">
            Shared With:
          </Text>
          <GridItem>
            {trip.shared_with.map((email) => (
              <Text key={email} fontSize="sm" color="gray.700">
                • {email}
              </Text>
            ))}
          </GridItem>
        </>
      )}
    </Grid>
  );
}
