import {
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Spacer,
  Stack,
  StackDivider,
  useToast,
} from "@chakra-ui/react";
import { UserProfile } from "components";
import { ROUTE_PATH, TOAST } from "config/constant";
import { Field, Form, FormikProvider, useFormik } from "formik";
import { useAuthContext } from "hooks/useAuthContext";
import { DashboardLayout, ProfileContainer } from "layouts";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "services";

function AddBankDetail() {
  const { user } = useAuthContext();
  const userData = user?.user;
  const navigate = useNavigate();
  const { id } = useParams();
  let initialValues = {
    basicSalary: userData?.basicSalary,
    email: userData?.email,
    password: userData?.password,
    accountNumber: userData?.bankDetails?.accountNumber,
    branchTransitNumber: userData?.bankDetails?.branchTransitNumber,
    institutionNumber: userData?.bankDetails?.institutionNumber,
    dateOfJoining: userData?.dateOfJoining,
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      try {
        handleSubmit(formValues);
      } catch (error) {
        console.log(error);
      }
    },
  });
  const toast = useToast();
  const handleSubmit = async (values) => {
    values.country = userData.address.country;
    values.bankName = "CIBC";
    values.employeeId = id;
    try {
      const updateData = await api.updateUserBankDetailsById(
        id,
        values,
        user.token
      );
      localStorage.setItem("bank", JSON.stringify(updateData.data));
      toast(TOAST.SUCCESS);
      navigate(ROUTE_PATH.BANK);
    } catch (error) {
      toast(TOAST.ERROR);
      // setError(error.response.data.error);
      console.log(error);
    }
  };
  return (
    <DashboardLayout>
      <ProfileContainer>
        <FormikProvider value={formik}>
          <Form>
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
                    <Button
                      type="submit"
                      variant="outline"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    &nbsp;
                    <Button type="submit" variant="primary">
                      Update
                    </Button>
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
                      {/* <Field name="basicSalary" key="basicSalary">
                        {({ field }) => (
                          <FormControl id="basicSalary">
                            <FormLabel>Annual Salary</FormLabel>
                            <Input
                              defaultValue={userData?.basicSalary}
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="email" key="email">
                        {({ field }) => (
                          <FormControl id="email">
                            <FormLabel>Email</FormLabel>
                            <Input defaultValue={userData?.email} {...field} />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="phoneNumber" key="phoneNumber">
                        {({ field }) => (
                          <FormControl id="phoneNumber">
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                              defaultValue={userData?.phoneNumber}
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field> */}
                      <Field name="accountNumber" key="accountNumber">
                        {({ field }) => (
                          <FormControl id="accountNumber">
                            <FormLabel>Account Number</FormLabel>
                            <Input
                              defaultValue={
                                userData?.bankDetails?.accountNumber
                              }
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field
                        name="branchTransitNumber"
                        key="branchTransitNumber"
                      >
                        {({ field }) => (
                          <FormControl id="branchTransitNumber">
                            <FormLabel>Branch Transit Number</FormLabel>
                            <Input
                              defaultValue={
                                userData?.bankDetails?.branchTransitNumber
                              }
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="institutionNumber" key="institutionNumber">
                        {({ field }) => (
                          <FormControl id="institutionNumber">
                            <FormLabel>Institution Number</FormLabel>
                            <Input
                              defaultValue={
                                userData?.bankDetails?.institutionNumber
                              }
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                    </SimpleGrid>
                  </Stack>
                </CardBody>
              </Card>
              {/* <Card>
                <CardBody>
                  <Stack divider={<StackDivider />}>
                    <Flex>
                      <Heading size="xs">Emergency Contact</Heading>

                      <Spacer />
                    </Flex>
                    <SimpleGrid columns={3} spacing={8}>
                      <Field name="basicSalary" key="basicSalary">
                        {({ field }) => (
                          <FormControl id="basicSalary">
                            <FormLabel>Annual Salary</FormLabel>
                            <Input
                              defaultValue={userData?.basicSalary}
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="email" key="email">
                        {({ field }) => (
                          <FormControl id="email">
                            <FormLabel>Email</FormLabel>
                            <Input defaultValue={userData?.email} {...field} />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="phoneNumber" key="phoneNumber">
                        {({ field }) => (
                          <FormControl id="phoneNumber">
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                              defaultValue={userData?.phoneNumber}
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="accountNumber" key="accountNumber">
                        {({ field }) => (
                          <FormControl id="accountNumber">
                            <FormLabel>Account Number</FormLabel>
                            <Input
                              defaultValue={
                                userData?.bankDetails?.accountNumber
                              }
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field
                        name="branchTransitNumber"
                        key="branchTransitNumber"
                      >
                        {({ field }) => (
                          <FormControl id="branchTransitNumber">
                            <FormLabel>Branch Transit Number</FormLabel>
                            <Input
                              defaultValue={
                                userData?.bankDetails?.branchTransitNumber
                              }
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="institutionNumber" key="institutionNumber">
                        {({ field }) => (
                          <FormControl id="institutionNumber">
                            <FormLabel>Institution Number</FormLabel>
                            <Input
                              defaultValue={
                                userData?.bankDetails?.institutionNumber
                              }
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                    </SimpleGrid>
                  </Stack>
                </CardBody>
              </Card> */}
            </Stack>
          </Form>
        </FormikProvider>
      </ProfileContainer>
    </DashboardLayout>
  );
}

export default AddBankDetail;
