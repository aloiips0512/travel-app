import {
  Box,
  Heading,
  Stack,
  type StackProps,
  StackSeparator,
} from "@chakra-ui/react";
import {
  LuBookmark,
  LuClock,
  LuCircleHelp,
  LuLayoutDashboard,
  LuChartPie,
  LuSettings,
} from "react-icons/lu";
import { Button, type ButtonProps } from "@chakra-ui/react";
import { UserProfile } from "./UserSidebarProfile";

export const Sidebar = (props: StackProps) => {
  return (
    <Stack
      flex="1"
      h="100vh"
      p={{ base: "4", md: "6" }}
      bg="rgba(0, 0, 0, 0.2)" // or 'rgba(0,0,0,0.2)' for dark
      backdropFilter="blur(10px)"
      borderRightWidth="1px"
      borderColor="whiteAlpha.300" // subtle border
      justifyContent="space-between"
      maxW="xs"
      {...props}
    >
      <Stack gap="6">
        <Stack direction={"row"} alignItems="center" h={12}>
          <Heading size="xl" fontWeight={"bold"}>
            My Music Club
          </Heading>
        </Stack>

        {/* <SearchField /> */}
        <Stack gap="1">
          <SidebarLink>
            <LuLayoutDashboard /> Dashboard
          </SidebarLink>
          <SidebarLink aria-current="page">
            <LuChartPie /> Analysis
          </SidebarLink>
          {/* <DocumentsLinks /> */}
          <SidebarLink>
            <LuClock /> History
          </SidebarLink>
          <SidebarLink>
            <LuBookmark /> Favorites
          </SidebarLink>
        </Stack>
      </Stack>
      <Stack gap="4" separator={<StackSeparator />}>
        <Box />
        <Stack gap="1">
          <SidebarLink>
            <LuCircleHelp /> Help Center
          </SidebarLink>
          <SidebarLink>
            <LuSettings /> Settings
          </SidebarLink>
        </Stack>
        <UserProfile />
      </Stack>
    </Stack>
  );
};

interface Props extends ButtonProps {
  href?: string;
}

export const SidebarLink = (props: Props) => {
  const { children, href, ...buttonProps } = props;
  return (
    <Button
      variant="ghost"
      width="full"
      justifyContent="start"
      gap="3"
      color="fg.muted"
      _hover={{
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
      }}
      _currentPage={{
        color: "colorPalette.fg",
      }}
      asChild
      {...buttonProps}
    >
      <a href={href}>{children}</a>
    </Button>
  );
};
