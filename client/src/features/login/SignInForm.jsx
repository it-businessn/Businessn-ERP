import {
  Center,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import GenericForm from "components/generic-form";
import { loginFormFields, loginInitialValues } from "config/formfields";
import { LoginSchema } from "config/schema";
import { useAuthContext } from "hooks/useAuthContext";
import { useLogin } from "hooks/useLogin";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/logo";

const SignInForm = ({ title }) => {
  const { user } = useAuthContext();
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await login(values);
  };
  if (user) {
    navigate("/");
  }
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <Center flex="1">
      <Stack
        spacing="8"
        px={{
          base: "4",
          md: "8",
        }}
        py={{
          base: "12",
          md: "48",
        }}
        width="full"
        maxW="sm"
      >
        <Stack spacing="6">
          {isMobile && <Logo />}
          <Stack
            spacing={{
              base: "2",
              md: "3",
            }}
            textAlign="center"
          >
            <Heading
              size={{
                base: "xs",
                md: "sm",
              }}
            >
              {title}
            </Heading>
          </Stack>
        </Stack>
        <Stack spacing="5">
          <GenericForm
            formSubmit={handleSubmit}
            schema={LoginSchema}
            initialValues={loginInitialValues}
            formFields={loginFormFields}
            isLoading={isLoading}
          />
          {error && <Text color="red">{error}</Text>}
        </Stack>
      </Stack>
    </Center>
  );
};
export default SignInForm;
