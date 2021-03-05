import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { Token, Item } from "../types";
import jwtDecode from "jwt-decode";
import { getAccessToken } from "../AccessToken";
import { ThoughtItem } from "../components/thought-list/components/ThoughtItem";
import { UserInfo } from "../components/profile/UserInfo";
import { AddThought } from "../components/add-thought/AddThought";

const GET_USER_THOUGHTS = gql`
  query GetUserThoughts($id: Float!) {
    getUserThoughts(id: $id) {
      id
      likes
      thought
    }
  }
`;

export const ProfilePage: React.FC = () => {
  const token = jwtDecode<Token>(getAccessToken());
  const id: number = token.userId;
  const [refresh, setRefresh] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_USER_THOUGHTS, {
    variables: { id },
  });

  useEffect(() => {
    refetch();
  }, [refresh]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("error", error);
    return <p>random</p>;
  }

  return (
    <Grid
      h="200px"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(2, 1fr)"
      gap={4}
    >
      <UserInfo token={token} />
      <GridItem colSpan={2}>
        {data.getUserThoughts.length > 0 ? (
          data.getUserThoughts.map((item: Item) => (
            <Box key={item.id} w="70%" mx="auto">
              <ThoughtItem item={item} />
            </Box>
          ))
        ) : (
          <AddThought setLoading={setRefresh} />
        )}
      </GridItem>
    </Grid>
  );
};
