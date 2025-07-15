import { Container, Flex } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = (props: LayoutProps) => {
  const { children } = props;
  return (
    <Flex direction="column" minH="100vh">
      <Navbar hideFrom="md" />
      <Flex flex="1" overflow="hidden">
        <Sidebar hideBelow="md" />
        <Container padding={4} maxW="full" overflowY="auto">
          {children}
        </Container>
      </Flex>
    </Flex>
  );
};
