import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
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
  const navigate = useNavigate();

  const onCancel = () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      navigate("/login");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
              <FormLabel>Password</FormLabel>
              <Input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Type of Role</FormLabel>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <option value="employee">Employee</option>
                <option value="sales_manager">Sales Manager</option>
                <option value="administrator">Administrator</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Type of Department</FormLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="sales">Sales and Marketing</option>
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
              <Button colorScheme="teal" type="submit">
                Add
              </Button>
              <Button colorScheme="gray" ml={2} onClick={onCancel}>
                Cancel
              </Button>
            </Flex>
          </form>
        </Stack>
      </Box>
    </Container>
  );
};

export default SignUp;
