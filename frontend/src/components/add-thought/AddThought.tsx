import React, { FunctionComponent, useState } from "react";
import { Box, Textarea, Button } from "@chakra-ui/react";
import { useMutation, gql } from "@apollo/client";
import { getAccessToken } from "../../AccessToken";
import jwtDecode from "jwt-decode";
import { Token } from "../../types";
import { filter } from "../../WordFilter";

const ADD_THOUGHT = gql`
  mutation AddThought($thoughtContent: String!, $userID: Float!) {
    setThought(thoughtContent: $thoughtContent, userID: $userID) {
      likes
      thought
    }
  }
`;

interface AddThoughtProps {
  setLoading: (loading: boolean) => any;
}

export const AddThought: FunctionComponent<AddThoughtProps> = ({
  setLoading,
}) => {
  const [addThought] = useMutation(ADD_THOUGHT);
  const [thought, setThought] = useState("");

  const handleClick = () => {
    const token: Token = jwtDecode<Token>(getAccessToken());
    const id: number = token.userId;

    const filteredThought = filter.clean(thought);

    addThought({
      variables: {
        thoughtContent: filteredThought,
        userID: id,
      },
    });
    setLoading(true);
    setThought("");
  };

  return (
    <Box w="70%" mx="auto" p={5}>
      <Textarea
        placeholder="Type here your thought..."
        size="sm"
        resize="none"
        value={thought}
        onChange={(e) => setThought(e.target.value)}
      />
      <Button size="md" onClick={handleClick}>
        Submit
      </Button>
    </Box>
  );
};
