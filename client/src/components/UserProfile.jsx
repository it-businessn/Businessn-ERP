import { Avatar, Box, HStack, Text } from "@chakra-ui/react";

const UserProfile = () => {
  return (
    <HStack color="#fff" pb={2}>
      <Avatar name="jk" src="" boxSize="12" />
      <Box>
        <Text fontWeight="medium" fontSize="sm" textTransform="capitalize">
          Admin one
        </Text>
        <Text color="muted" fontSize="sm">
          admin@team.com
        </Text>
      </Box>
    </HStack>
  );
};
export default UserProfile;
