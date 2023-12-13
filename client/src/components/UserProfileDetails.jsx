import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaAddressCard } from "react-icons/fa";
import * as api from "services";
import ChangePassword from "./ChangePassword";

const UserProfileDetails = () => {
  const [profileData, setProfileData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(profileData));
  }, [profileData]);

  const handleEditClick = () => {
    setEditMode(true);
    setPasswordMode(false);
  };
  const handlePasswordClick = () => {
    setEditMode(false);
    setPasswordMode(true);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    try {
      const response = await api.updateUserProfile(
        profileData,
        profileData._id
      );
      setEditMode(false);
      setProfileData((prev) => response.data);
    } catch (error) {
      console.error("Error adding user:", error?.response?.data);
      setError(error?.response?.data?.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box
      m="2em"
      p={4}
      justifyContent="center"
      borderWidth="1px"
      borderRadius="lg"
    >
      <HStack maxW="100%">
        <Stack flex={1}>
          <VStack align="center" justify="center" mb="4">
            <Avatar name=" " size="lg" bg="gray.300" position="relative">
              <FaAddressCard className="header-logo" />
            </Avatar>
            <Box textAlign="center">
              <Heading as="h2" size="lg" mb={2}>
                {profileData.fullName}
              </Heading>
              <Text color="gray.500" mb={4}>
                {profileData.email}
              </Text>
            </Box>
          </VStack>
          <VStack spacing={4} align="start">
            <Text>
              <strong>Company ID:</strong> {profileData.companyId}
            </Text>
            <Text>
              <strong> Name:</strong> {profileData.fullName}
            </Text>
            <Text>
              <strong>Phone:</strong> {profileData.phoneNumber}
            </Text>
            <Text>
              <strong>Role:</strong> {profileData.role}
            </Text>
            <Text>
              <strong>Department:</strong> {profileData.department}
            </Text>
            <Text>
              <strong>Manager:</strong> {profileData.manager}
            </Text>
            <Text>
              <strong>Address:</strong> {profileData.address}
            </Text>
            <HStack>
              <Button
                colorScheme="teal"
                isDisabled={editMode}
                onClick={handleEditClick}
              >
                Edit
              </Button>
              <Button
                colorScheme="teal"
                isDisabled={passwordMode}
                onClick={handlePasswordClick}
              >
                Change Password
              </Button>
            </HStack>
          </VStack>
        </Stack>
        {editMode && (
          <>
            <Divider
              orientation="vertical"
              height="600px"
              borderWidth="1px"
              borderColor="gray.300"
            />
            <Stack flex={1}>
              <form onSubmit={handleSaveClick}>
                <VStack align="center" justify="center" mb="4">
                  <Box textAlign="center">
                    <Text fontSize="xl" fontWeight="bold">
                      Edit Profile Information
                    </Text>
                  </Box>
                </VStack>
                <FormControl mb={4}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    value={profileData?.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    value={profileData?.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={profileData?.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="text"
                    name="phone"
                    value={profileData?.phoneNumber}
                    onChange={handleChange}
                    placeholder="phone"
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Address</FormLabel>
                  <Input
                    type="text"
                    name="primaryContactAddress"
                    value={profileData?.address}
                    onChange={handleChange}
                    placeholder="Primary Contact"
                  />
                </FormControl>
                <Button colorScheme="teal" type="submit">
                  Save
                </Button>
                {error && (
                  <Alert status="error" mt={4}>
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
              </form>
            </Stack>
          </>
        )}
        {passwordMode && (
          <>
            <Divider
              orientation="vertical"
              height="600px"
              borderWidth="1px"
              borderColor="gray.300"
            />
            <ChangePassword setPasswordMode={setPasswordMode} />
          </>
        )}
      </HStack>
    </Box>
  );
};

export default UserProfileDetails;
