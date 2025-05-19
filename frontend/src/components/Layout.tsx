import { Container, Flex } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = (props: LayoutProps) => {
  const { children } = props;
  return (
    <>
      <Navbar hideFrom="md" />
      <Flex flex="1">
        <Sidebar hideBelow="md" />
        <Container p={4}>{children}</Container>
      </Flex>
    </>
  );
};
