import {
  Container,
  HStack,
  IconButton,
  Drawer,
  CloseButton,
  Portal,
} from "@chakra-ui/react";
import type { ContainerProps } from "@chakra-ui/react";
import { LuAlignRight } from "react-icons/lu";

import { Sidebar } from "./Sidebar";
export const Navbar = (props: ContainerProps) => {
  return (
    <Container
      py="2.5"
      background="bg.panel"
      borderBottomWidth="1px"
      {...props}
    >
      <HStack justify="space-between">
        <Drawer.Root placement="start">
          <Drawer.Trigger asChild>
            <IconButton
              aria-label="Open Menu"
              variant="ghost"
              colorPalette="gray"
            >
              <LuAlignRight />
            </IconButton>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" colorPalette="gray" />
                </Drawer.CloseTrigger>
                <Sidebar />
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </HStack>
    </Container>
  );
};
