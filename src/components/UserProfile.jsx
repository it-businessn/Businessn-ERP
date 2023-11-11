import { Avatar, Box, HStack, Text } from "@chakra-ui/react";

const UserProfile = () => {
  return (
    <HStack spacing="3">
      <Avatar name="jk" src="" boxSize="12" />
      <Box>
        <Text fontWeight="medium" fontSize="sm" textTransform="capitalize">
          jk
        </Text>
        <Text color="muted" fontSize="sm">
          dfh@dfh.com
        </Text>
      </Box>
    </HStack>
  );
};
export default UserProfile;
