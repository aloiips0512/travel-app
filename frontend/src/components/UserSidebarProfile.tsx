import { Avatar, Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuEllipsisVertical } from "react-icons/lu";
import { supabase } from "../supabaseClient";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);
  return (
    <HStack gap="3" justify="space-between">
      <HStack gap="3">
        <Avatar.Root>
          <Avatar.Fallback />
          <Avatar.Image src={user?.user_metadata.picture} />
        </Avatar.Root>
        <Box>
          <Text textStyle="sm" fontWeight="medium">
            {user?.user_metadata.name}
          </Text>
          <Text textStyle="sm" color="fg.muted">
            {user?.user_metadata.email}
          </Text>
        </Box>
      </HStack>
      <IconButton variant="ghost" colorPalette="gray" aria-label="Open Menu">
        <LuEllipsisVertical />
      </IconButton>
    </HStack>
  );
};
