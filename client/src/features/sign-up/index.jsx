import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
} from "@chakra-ui/react";
import Logo from "components/logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "services";

const SignUp = () => {
  const [formData, setFormData] = useState({
    companyId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    fullName: "",
    email: "",
    password: "",
    role: "employee",
    department: "sales",
    manager: "",
    phoneNumber: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    formData.fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`;
    try {
      await api.signUp(formData);
      setFormData({
        companyId: "",
        firstName: "",
        middleName: "",
        lastName: "",
        fullName: "",
        email: "",
        password: "",
        role: "employee",
        department: "sales",
        manager: "",
        phoneNumber: "",
        address: "",
      });
      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      console.error("Error adding user:", error?.response?.data);
      setError(error?.response?.data?.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel>Company Id</FormLabel>
              <Input
                type="text"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                placeholder="Company Id"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Middle Name</FormLabel>
              <Input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Middle Name"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Password</FormLabel>{" "}
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                <InputRightElement>
                  <Button
                    size="sm"
                    variant="unstyled"
                    onClick={handleTogglePassword}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Type of Role</FormLabel>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <option value="Employee">Employee</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Administrator">Administrator</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Type of Department</FormLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Sales and Marketing">Sales and Marketing</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Manager</FormLabel>
              <Input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                placeholder="Manager"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </FormControl>
            <Flex justifyContent="flex-end">
              <Button isLoading={isLoading} colorScheme="teal" type="submit">
                Add
              </Button>
              <Button colorScheme="gray" ml={2} onClick={onCancel}>
                Cancel
              </Button>
            </Flex>
          </form>
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default SignUp;
