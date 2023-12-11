import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const EditContactForm = ({ selectedContact, onSave, onCancel }) => {
  const [formData, setFormData] = useState(selectedContact);
  useEffect(() => {
    setFormData(selectedContact);
  }, [selectedContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };
  return (
    <Box mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <form>
        <HStack maxW="100%" justify="center">
          <Stack flex={1} spacing={4}>
            <FormLabel as="legend">Primary Contact Information</FormLabel>
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
                placeholder="Email"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="phone"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Primary Contact Address</FormLabel>
              <Input
                type="text"
                name="primaryContactAddress"
                value={formData.primaryContactAddress}
                onChange={handleChange}
                placeholder="Primary Contact"
              />
            </FormControl>
          </Stack>
          <Stack flex={1} spacing={4}>
            <FormLabel as="legend">Company Information</FormLabel>
            <FormControl mb={4}>
              <FormLabel>Company Name</FormLabel>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company Name"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Industry Type</FormLabel>
              <Input
                type="text"
                name="industryType"
                value={formData.industryType}
                onChange={handleChange}
                placeholder="Industry Type"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Company Address</FormLabel>
              <Input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Company Address"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Website URL</FormLabel>
              <Input
                type="url"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                placeholder="Website URL"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Number of employees</FormLabel>
              <Input
                type="number"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                placeholder="Number of employees"
              />
            </FormControl>
          </Stack>
        </HStack>
        <Button colorScheme="teal" onClick={handleSave}>
          Save
        </Button>
        <Button colorScheme="gray" ml={2} onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </Box>
  );
};

export default EditContactForm;
