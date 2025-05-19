import { Heading, Button, VStack, HStack, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";
import { TripList } from "../components/TripList";
import AddTripForm from "../components/AddTripForm";

export default function Homepage() {
  const [view, setView] = useState<"list" | "add">("list");
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);
  return (
    <>
      <Heading>Welcome to Travel App!</Heading>
      <VStack align="center" mt={10} w="full">
        <HStack>
          <Button colorScheme="teal" onClick={() => setView("list")}>
            View My Trips
          </Button>
          <Button colorScheme="teal" onClick={() => setView("add")}>
            Add New Trip
          </Button>
        </HStack>
        {view === "list" ? (
          <Box w="full">
            <TripList />
          </Box>
        ) : (
          <Box w="full">
            <AddTripForm userId={user!.id} />
          </Box>
        )}
      </VStack>
    </>
  );
}
