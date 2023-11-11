import {
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
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { userCurrency } from "utils";

const BankDetail = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const bank = JSON.parse(localStorage.getItem("bank"));
  const handleClick = (e) => {
    e.preventDefault();
    return navigate(`/add-bank-detail/${user.user._id}`);
  };

  const userData = user?.user;
  // const [record, setRecord] = useState(null);
  // useEffect(() => {
  //     const fetchUserData = async (id) => {
  //         try {
  //             let result = await api.getUserById(id, user.token);
  //             const response = result;
  //             response.map((user) => {
  //                 let middleName = !user?.middleName ? "" : user.middleName;
  //                 user.name = `${user.firstName} ${middleName} ${user.lastName}`;
  //                 return user;
  //             });
  //             setRecord(response);
  //         } catch (error) {}
  //     };
  //     fetchUserData(user.user._id);
  // }, []);
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
                  {userData && (
                    <UserProfile
                      user={userData}
                      image="https://tinyurl.com/yhkm2ek8"
                    />
                  )}
                </Stack>
                <Spacer />
                <IconButton
                  onClick={handleClick}
                  icon={<FiEdit2 fontSize="1.25rem" />}
                  variant="outline"
                  aria-label="Add Bank Detail"
                />
              </Flex>
            </CardBody>
          </Card>
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
          {/* <Card>
                        <CardBody>
                            <Stack divider={<StackDivider />}>
                                <Flex>
                                    <Heading size="xs">
                                        Emergency Contact
                                    </Heading>
                                    <Spacer />
                                </Flex>
                                <SimpleGrid columns={3} spacing={8}>
                                    <FormControl id="annualSalary">
                                        <FormLabel>Annual Salary</FormLabel>
                                        <Text>
                                            {userCurrency(
                                                user.user?.bankDetails.currency
                                            ).format(user.user.basicSalary)}
                                        </Text>
                                    </FormControl>
                                    <FormControl id="email">
                                        <FormLabel>Email address</FormLabel>
                                        <Text>{userData.email}</Text>
                                    </FormControl>
                                    <FormControl id="role">
                                        <FormLabel>Mode Of Payment</FormLabel>
                                        <Text>
                                            {userData?.preferredModeOfPayment}
                                        </Text>
                                    </FormControl>
                                    <FormControl id="accountNumber">
                                        <FormLabel>Account Number</FormLabel>
                                        <Text>
                                            {
                                                userData?.bankDetails
                                                    ?.accountNumber
                                            }
                                        </Text>
                                    </FormControl>
                                    <FormControl id="branchTransitNumber">
                                        <FormLabel>
                                            Branch Transit Number
                                        </FormLabel>
                                        <Text>
                                            {
                                                userData?.bankDetails
                                                    ?.branchTransitNumber
                                            }
                                        </Text>
                                    </FormControl>
                                    <FormControl id="institutionNumber">
                                        <FormLabel>
                                            Institution Number
                                        </FormLabel>
                                        <Text>
                                            {
                                                userData?.bankDetails
                                                    ?.institutionNumber
                                            }
                                        </Text>
                                    </FormControl>
                                </SimpleGrid>
                            </Stack>
                        </CardBody>
                    </Card> */}
        </Stack>
      </ProfileContainer>
    </DashboardLayout>
  );
};

export default BankDetail;
