import React, { useEffect, useState } from "react";
import { Button, Text, Flex, Spacer, HStack, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../AccessToken";
import { NotLoggedIn } from "./components/NotLoggedIn";
import { LoggedIn } from "./components/LoggedIn";

interface HeaderProps {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ refresh, setRefresh }) => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (getAccessToken()) setIsLogged(true);
    else setIsLogged(false);
    setRefresh(false);
  }, [refresh]);

  return (
    <Box
      style={{
        position: "sticky",
        overflow: "hidden",
        top: 0,
      }}
    >
      <Flex bg="brand.900" grid>
        <Text
          as={Link}
          to="/"
          textAlign={"start"}
          color="brand.700"
          fontSize={35}
          paddingLeft={10}
        >
          Random Thoughts...
        </Text>
        <Spacer />
        <HStack mr={5}>
          {isLogged ? <LoggedIn setRefresh={setRefresh} /> : <NotLoggedIn />}
        </HStack>
      </Flex>
    </Box>
  );
};
