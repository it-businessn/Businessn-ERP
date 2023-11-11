import {
  Box,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  SimpleGrid,
  Spacer,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { UserProfile } from "components";
import { useAuthContext } from "hooks/useAuthContext";
import { DashboardLayout, ProfileContainer } from "layouts";
import { useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuthContext();

  const bank = JSON.parse(localStorage.getItem("bank"));
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    return navigate(`/edit-user/${user?.user?._id}`);
  };
  useEffect(() => {}, [user]);
  return (
    <DashboardLayout>
      <ProfileContainer>
        <Stack
          spacing={{
            base: "8",
            lg: "6",
          }}
        >
          <Card>
            <CardBody>
              <Flex>
                <Stack
                  spacing={{
                    base: "5",
                    sm: "6",
                  }}
                >
                  {user && (
                    <UserProfile
                      user={user?.user}
                      image="https://tinyurl.com/yhkm2ek8"
                    />
                  )}
                </Stack>
                <Spacer />
                {/* <IconButton
                  onClick={handleClick}
                  icon={<FiEdit2 fontSize="1.25rem" />}
                  variant="outline"
                  aria-label="Edit employee"
                /> */}
              </Flex>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stack divider={<StackDivider />}>
                <Flex>
                  <Heading size="xs">Personal Information</Heading>
                </Flex>
                <Box>
                  <SimpleGrid columns={3} spacing={8}>
                    <FormControl id="firstName">
                      <FormLabel>First Name</FormLabel>
                      <Text>{user?.user?.firstName}</Text>
                    </FormControl>
                    <FormControl id="middleName">
                      <FormLabel>Middle Name</FormLabel>
                      <Text>{user?.user?.middleName}</Text>
                    </FormControl>
                    <FormControl id="lastName">
                      <FormLabel>Last Name</FormLabel>
                      <Text>{user?.user?.lastName}</Text>
                    </FormControl>
                    <FormControl id="phone">
                      <FormLabel>Phone Number</FormLabel>
                      <Text>{user?.user?.phoneNumber}</Text>
                    </FormControl>

                    <FormControl id="role">
                      <FormLabel>Role</FormLabel>
                      <Text>{user?.user?.role}</Text>
                    </FormControl>
                    <FormControl id="department">
                      <FormLabel>Department</FormLabel>
                      <Text>{user?.user?.department}</Text>
                    </FormControl>
                  </SimpleGrid>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stack divider={<StackDivider />}>
                <Flex>
                  <Heading size="xs">Address</Heading>
                </Flex>

                <Box>
                  <SimpleGrid columns={3} spacing={8}>
                    <FormControl id="street">
                      <FormLabel>Street Number</FormLabel>
                      <Text>{user?.user?.address.streetNumber}</Text>
                    </FormControl>
                    <FormControl id="city">
                      <FormLabel>City</FormLabel>
                      <Text>{user?.user?.address.city}</Text>
                    </FormControl>
                    <FormControl id="state">
                      <FormLabel>State / Province</FormLabel>
                      <Text>{user?.user?.address.state}</Text>
                    </FormControl>
                    <FormControl id="zip">
                      <FormLabel>ZIP/ Postal Code</FormLabel>
                      <Text>{user?.user?.address.postalCode}</Text>
                    </FormControl>
                    <FormControl id="country">
                      <FormLabel>Country</FormLabel>
                      <Text>{user?.user?.address.country}</Text>
                    </FormControl>
                  </SimpleGrid>
                </Box>
              </Stack>
            </CardBody>
          </Card>{" "}
          <Card>
            <CardBody>
              <Stack divider={<StackDivider />}>
                <Flex>
                  <Heading size="xs">Bank Information</Heading>
                  <Spacer />
                </Flex>
                <SimpleGrid columns={3} spacing={8}>
                  {/* <FormControl id="annualSalary">
                    <FormLabel>Annual Salary</FormLabel>
                    <Text>{userData?.basicSalary}</Text>
                  </FormControl>
                  <FormControl id="email">
                    <FormLabel>Email address</FormLabel>
                    <Text>{userData.email}</Text>
                  </FormControl>
                  <FormControl id="role">
                    <FormLabel>Mode Of Payment</FormLabel>
                    <Text>{userData?.preferredModeOfPayment}</Text>
                  </FormControl> */}
                  <FormControl id="accountNumber">
                    <FormLabel>Account Number</FormLabel>
                    <Text>{bank?.accountNumber}</Text>
                  </FormControl>
                  <FormControl id="branchTransitNumber">
                    <FormLabel>Branch Transit Number</FormLabel>
                    <Text>{bank?.branchTransitNumber}</Text>
                  </FormControl>
                  <FormControl id="institutionNumber">
                    <FormLabel>Institution Number</FormLabel>
                    <Text>{bank?.institutionNumber}</Text>
                  </FormControl>
                </SimpleGrid>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </ProfileContainer>
    </DashboardLayout>
  );
};

export default Profile;
