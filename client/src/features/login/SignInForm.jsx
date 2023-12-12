import {
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
import { useLogin } from "hooks/useLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "services";
import Logo from "../../components/logo";

const SignInForm = ({ title }) => {
  const { user } = useAuthContext();
  const { login, error, isLoading } = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.signIn(formData);
      setFormData({
        email: "",
        password: "",
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      console.error("Error adding user:", error);
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

              <Button type="submit" colorScheme="teal">
                Login
              </Button>
            </Stack>
          </form>
          {error && <Text color="red">{error}</Text>}
        </Stack>
      </Stack>
    </Center>
  );
};
export default SignInForm;
