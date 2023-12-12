import {
  Avatar,
  Box,
  Flex,
  Heading,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";

const UserProfileDetails = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Flex align="center" justify="center" height="100vh">
      <Box
        p={8}
        maxWidth="600px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Avatar size="xl" name={user.name} src={user.avatar} mb={4} />
        <Heading as="h2" size="lg" mb={2}>
          {user.fullName}
        </Heading>
        <Text color="gray.500" mb={4}>
          {user.email}
        </Text>

        <VStack spacing={4} align="start">
          <Text>
            <strong>CompanyID:</strong> {user.companyId}
          </Text>
          <Text>
            <strong> Name:</strong> {user.fullName}
          </Text>
          <Text>
            <strong>Phone:</strong> {user.phoneNumber}
          </Text>
          <Text>
            <strong>Role:</strong> {user.role}
          </Text>
          <Text>
            <strong>Department:</strong> {user.department}
          </Text>
          <Text>
            <strong>Manager:</strong> {user.manager}
          </Text>
          <Text>
            <strong>Address:</strong> {user.address}
          </Text>
        </VStack>

        <Spacer />

        {/* <Button colorScheme="teal" variant="outline">
          Edit Profile
        </Button> */}
      </Box>
    </Flex>
  );
};

export default UserProfileDetails;
