import {
  Button,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import GenericForm from "components/generic-form";
import {
  resetPasswordFormFields,
  resetPasswordInitialValues,
} from "config/formfields";
import { ResetPasswordSchema } from "config/schema";
import CenterBoxLayout from "layouts/CenterBoxLayout";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as api from "services";
import Logo from "../../components/logo";

const ForgotPassword = () => {
  const [hasError, setErrorMessage] = useState("");
  const [captionTitle, setCaptionTitle] = useState("");

  const handleSubmit = async (values) => {
    try {
      const response = await api.forgotPassword(values);
      setCaptionTitle(response.data.message);
      setErrorMessage("");
    } catch (error) {
      setCaptionTitle("Sorry! Unable to sent reset link!");
      setErrorMessage(error.response.data.error);
      console.log(error);
    }
  };
  return (
    <CenterBoxLayout>
      <Stack spacing="6">
        <Logo />
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
            Forgot your password?
          </Heading>
          <Text color="fg.muted">You'll get an email with a reset link</Text>
        </Stack>
      </Stack>
      <Stack spacing="6">
        <Stack spacing="4">
          {!captionTitle && (
            <GenericForm
              formSubmit={handleSubmit}
              schema={ResetPasswordSchema}
              initialValues={resetPasswordInitialValues}
              formFields={resetPasswordFormFields}
            />
          )}
          {captionTitle && (
            <>
              <Text color="green">{captionTitle}</Text>
              <Link to="/">
                <Button width="100%" variant="primary">
                  Back to Login
                </Button>
              </Link>
            </>
          )}
        </Stack>
        <HStack>
          <Divider />
          <Text textStyle="sm" color="fg.muted">
            OR
          </Text>
          <Divider />
        </HStack>
      </Stack>

      {hasError && <Text color="red">{hasError}</Text>}
      <HStack spacing="1" justify="center">
        <Text textStyle="sm" color="fg.muted">
          Having issues?
        </Text>
        <Button variant="text" size="sm">
          Contact us
        </Button>
      </HStack>
    </CenterBoxLayout>
  );
};
export default ForgotPassword;
