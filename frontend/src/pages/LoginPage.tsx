import { Button, Center, Heading, VStack } from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

export default function LoginPage() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error logging in:", error.message);
  };

  return (
    <Center h="100vh" bg="gray.50">
      <VStack p={8} bg="white" borderRadius="lg" boxShadow="md">
        <Heading size="lg" mb={4}>
          Welcome to Travel App
        </Heading>
        <Button colorScheme="teal" size="lg" onClick={handleLogin}>
          Login with Google
        </Button>
      </VStack>
    </Center>
  );
}
