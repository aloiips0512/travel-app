// components/AppLayout.tsx
import {
  Box,
  Drawer,
  DrawerContent,
  Flex,
  IconButton,
  useBreakpointValue,
  Text,
  VStack,
  HStack,
  DrawerTrigger,
  Portal,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerCloseTrigger,
  CloseButton,
  Link,
} from "@chakra-ui/react";
import { Menu, MapPinned, PlusCircle } from "lucide-react";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export default function AppLayout({ children }: Props) {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar for desktop */}
      {isDesktop && (
        <Box
          w="250px"
          pos="fixed"
          h="full"
          bg="white"
          borderRight="1px solid"
          borderColor="gray.200"
        >
          <SidebarContent />
        </Box>
      )}

      {/* Mobile drawer */}
      {!isDesktop && (
        <Drawer.Root>
          {/* Trigger */}
          <DrawerTrigger asChild>
            <IconButton aria-label="Open menu" variant="ghost" m={4}>
              <Menu />
            </IconButton>
          </DrawerTrigger>

          <Portal>
            <DrawerBackdrop />
            <DrawerPositioner>
              <DrawerContent>
                {/* Close button */}
                <DrawerCloseTrigger asChild>
                  <CloseButton
                    size="sm"
                    position="absolute"
                    top="4"
                    right="4"
                  />
                </DrawerCloseTrigger>
                <SidebarContent />
              </DrawerContent>
            </DrawerPositioner>
          </Portal>
        </Drawer.Root>
      )}

      {/* Main content */}
      <Box flex="1" ml={{ base: 0, md: "250px" }}>
        <TopNav
          onOpen={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <Box as="main" p={6}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const items: Array<{ icon: ReactNode; label: string; href: string }> = [
    { icon: <MapPinned size={18} />, label: "My Trips", href: "/trips" },
    { icon: <PlusCircle size={18} />, label: "Add Trip", href: "/trips/new" },
  ];

  return (
    <VStack align="stretch" p={6}>
      <Text fontSize="lg" fontWeight="bold">
        Travel App
      </Text>
      {items.map(({ icon, label, href }) => (
        <Link key={href} href={href}>
          <NavItem icon={icon} onClick={onClose}>
            {label}
          </NavItem>
        </Link>
      ))}
    </VStack>
  );
}

function NavItem({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <HStack
      as="a"
      py={2}
      px={3}
      borderRadius="md"
      _hover={{ bg: "gray.100", cursor: "pointer" }}
      onClick={onClick}
    >
      {icon}
      <Text fontSize="sm">{children}</Text>
    </HStack>
  );
}

function TopNav({ onOpen }: { onOpen: () => void }) {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={4}
      py={3}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={2}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        aria-label="Open menu"
        variant="ghost"
      >
        <Menu />
      </IconButton>
      <Text fontWeight="bold">Dashboard</Text>
    </Flex>
  );
}
