import {
  Alert,
  AlertIcon,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useAuthContext } from "hooks/useAuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "services";
import Logo from "../../components/logo";

const SignInForm = ({ title }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.signIn(formData);
      setFormData({
        email: "",
        password: "",
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      console.error("Error adding user:", error?.response?.data);
      setError(error?.response?.data?.error);
    }
  };
  if (user) {
    navigate("/");
  }
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
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
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <Button isLoading={isLoading} type="submit" colorScheme="teal">
                Login
              </Button>
            </Stack>
          </form>
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
        </Stack>
      </Stack>
    </Center>
  );
};
export default SignInForm;
