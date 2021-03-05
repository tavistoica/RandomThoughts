import React, { FunctionComponent, useState } from "react";
import { Text, Button, Icon } from "@chakra-ui/react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useMutation, gql } from "@apollo/client";
import jwtDecode from "jwt-decode";
import { Token } from "../../../types";
import { getAccessToken } from "../../../AccessToken";

type LikeType = {
  id: number;
  likes: number[];
};

const SET_LIKE = gql`
  mutation AddLike($id: Float!, $userID: Float!) {
    addLike(id: $id, userID: $userID) {
      likes
      thought
    }
  }
`;

export const LikeButton: FunctionComponent<LikeType> = ({ id, likes }) => {
  const token = getAccessToken();
  const tokenDecoded = token && jwtDecode<Token>(token);
  let userID: number = tokenDecoded ? tokenDecoded.userId : NaN;
  const [buttonLikes, setButtonLikes] = useState(likes.length);
  const [buttonHeart, setButtonHeart] = useState(
    token && likes.includes(userID) ? true : false
  );
  const [addLike] = useMutation(SET_LIKE);

  const handleClick = () => {
    if (getAccessToken()) {
      addLike({ variables: { id, userID } });
      setButtonLikes(buttonHeart ? buttonLikes - 1 : buttonLikes + 1);
      setButtonHeart(!buttonHeart);
    }
  };

  return (
    <Button variant="ghost" onClick={handleClick}>
      <Icon
        as={buttonHeart ? AiFillHeart : AiOutlineHeart}
        w={6}
        h={6}
        color="red"
      />
      <Text>{buttonLikes}</Text>
    </Button>
  );
};
