import React from "react";
import { Box, Text } from "@chakra-ui/react";

const ResourceCard = ({ resource }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Text>{resource.title}</Text>
    </Box>
  );
};

export default ResourceCard;
