import React, { FunctionComponent, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { ThoughtItem } from "./components/ThoughtItem";
import { Item } from "../../types";
import { Box } from "@chakra-ui/react";

const GET_THOUGHTS = gql`
  query {
    getThoughts {
      id
      likes
      thought
      updatedAt
    }
  }
`;

interface ThoughListProps {
  reload: boolean;
}

export const ThoughtList: FunctionComponent<ThoughListProps> = ({ reload }) => {
  const { loading, error, data, refetch } = useQuery(GET_THOUGHTS);

  useEffect(() => {
    refetch();
  }, [reload]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("error", error);
    return <p>random</p>;
  }

  return data.getThoughts.map((item: Item) => (
    <Box key={item.id} w="70%" mx="auto">
      <ThoughtItem item={item} />
    </Box>
  ));
};
