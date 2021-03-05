import { Button } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "../../../AccessToken";
import { gql, useMutation } from "@apollo/client";

const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser
  }
`;

interface LoggedInProps {
  setRefresh: (refresh: boolean) => any;
}

export const LoggedIn: React.FC<LoggedInProps> = ({ setRefresh }) => {
  const [logoutUser] = useMutation(LOGOUT_USER);

  const handleLogout = () => {
    setAccessToken("");
    logoutUser();
    setRefresh(true);
  };

  return (
    <>
      <Button
        as={Link}
        variant="ghost"
        color="blue.100"
        border="1px"
        borderColor="brand.900"
        to="/profile"
        _hover={{ border: "1px", borderColor: "blue.500" }}
      >
        Profile
      </Button>
      <Button
        as={Link}
        variant="ghost"
        color="red.100"
        border="1px"
        borderColor="brand.900"
        to="/"
        _hover={{ border: "1px", borderColor: "red.500" }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );
};
