import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import GenericForm from "components/generic-form";
import Logo from "components/logo";
import { signUpFormFields, signUpInitialValues } from "config/formfields";
import { UserSchema } from "config/schema";
import { Country } from "country-state-city";
import { useSignup } from "hooks/useSignup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "services";

const SignUp = () => {
  const [countryList, setCountryList] = useState("");
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        let result = await Country.getAllCountries();
        setCountryList(result);
      } catch (error) {}
    };
    const fetchConfigurationOptionsByDepartment = async (key) => {
      let configuration = await api.getConfigurationsByName(key);
      let departmentField = signUpFormFields.find((item) => item.id === key);
      configuration.data.items.forEach((department) =>
        departmentField.options.push(department.name)
      );
    };
    const fetchConfigurationOptionsByRole = async (key) => {
      let configuration = await api.getConfigurationsByName(key);
      let roleField = signUpFormFields.find((item) => item.id === key);
      configuration.data.items.forEach((role) =>
        roleField.options.push(role.name)
      );
    };
    const fetchConfigurationOptionsByEmpType = async (key) => {
      let configuration = await api.getConfigurationsByName(key);
      let empTypeField = signUpFormFields.find((item) => item.id === key);
      configuration.data.items.forEach((empType) =>
        empTypeField.options.push(empType.name)
      );
    };
    const fetchConfigurationOptionsByManager = async (key) => {
      let configuration = await api.getConfigurationsByName(key);
      let approverField = signUpFormFields.find((item) => item.id === key);
      configuration.data.items.forEach((approver) =>
        approverField.options.push(approver.name)
      );
    };
    fetchConfigurationOptionsByDepartment("department");
    fetchConfigurationOptionsByRole("role");
    fetchConfigurationOptionsByEmpType("empType");
    fetchConfigurationOptionsByManager("approver");
    fetchCountry();
  }, []);
  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const result = await signup(values);
      if (result.statusText === "OK") {
        navigate("/verify-email");
      }
    } catch (error) {
      // setError(error.response.data.error);
      console.log(error);
    }
  };

  return (
    <Container
      py={{
        base: "3",
      }}
      maxW="3xl"
    >
      <Box>
        <Stack spacing="8">
          <Stack align="center">
            <Logo />
            <Stack spacing="3" textAlign="center">
              <Heading
                size={{
                  base: "xs",
                  md: "sm",
                }}
              >
                Create an account
              </Heading>
            </Stack>
          </Stack>
          {countryList && (
            <GenericForm
              id="sign-up"
              formSubmit={handleSubmit}
              schema={UserSchema}
              initialValues={signUpInitialValues}
              formFields={signUpFormFields}
              countryList={countryList}
              isLoading={isLoading}
            />
          )}
          {/* <HStack justify="center" spacing="1">
            <Text textStyle="sm" color="fg.muted">
              Already have an account?
            </Text>
            <Link to="/sign-in">
              <Button variant="text" size="sm">
                Log in
              </Button>
            </Link>
          </HStack> */}
          {error && <Text color="red">{error}</Text>}
        </Stack>
      </Box>
    </Container>
  );
};
export default SignUp;
