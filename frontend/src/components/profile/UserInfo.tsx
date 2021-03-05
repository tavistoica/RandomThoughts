import { gql, useQuery } from "@apollo/client";
import { Avatar, Box, GridItem, Text } from "@chakra-ui/react";
import React from "react";
import { Token } from "../../types";

const GET_USER = gql`
  query GetUser($id: Float!) {
    getUser(id: $id) {
      userID
      username
    }
  }
`;

interface UserInfoProps {
  token: Token;
}

export const UserInfo: React.FC<UserInfoProps> = ({ token }) => {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: token.userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("error", error);
    return <p>random</p>;
  }

  console.log("data", data);

  return (
    <GridItem bgColor="blue.100" textAlign="center" colSpan={2}>
      <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" size="2xl" />
      <Text>{data.getUser.username}</Text>
    </GridItem>
  );
};
