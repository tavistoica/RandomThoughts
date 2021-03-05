import { Button } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

export const NotLoggedIn: React.FC = () => {
  return (
    <>
      <Button
        as={Link}
        variant="ghost"
        color="blue.100"
        border="1px"
        borderColor="brand.900"
        to="/login"
        _hover={{ border: "1px", borderColor: "blue.500" }}
      >
        Login
      </Button>
      <Button
        as={Link}
        variant="ghost"
        color="green.100"
        to="/register"
        border="1px"
        borderColor="brand.900"
        _hover={{ border: "1px", borderColor: "green.500" }}
      >
        Register
      </Button>
    </>
  );
};
