import React, { FunctionComponent } from "react";
import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { Item } from "../../../types";
import { LikeButton } from "./LikeButton";

interface ThoughtItemProps {
  item: Item;
}

export const ThoughtItem: FunctionComponent<ThoughtItemProps> = ({ item }) => {
  return (
    <Box margin={5} borderRadius={10} border="1px" borderColor="brand.700">
      <Text paddingBottom={3} paddingTop={3} fontSize={25} ml={5} mr={5}>
        {item.thought}
      </Text>
      <Flex>
        <LikeButton id={item.id} likes={item.likes} />
        <Spacer />
        {/* <Text>{new Date(item.updatedAt)}</Text> */}
      </Flex>
    </Box>
  );
};
