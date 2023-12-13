import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "services";

const AddOpportunity = () => {
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    stage: "",
    probability: 0,
    dealAmount: 0,
    // closingDate: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.addOpportunity(formData);
      setFormData({ name: "", amount: "", closingDate: "" });
      navigate("/pipeline");
    } catch (error) {
      console.error("Error adding opportunity:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Opportunity Name</FormLabel>
          <FormHelperText>Enter opportunity name description</FormHelperText>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Opportunity Name"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Client Name</FormLabel>
          <Input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Client Name"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Stage</FormLabel>
          <Select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            placeholder="Select stage"
          >
            <option value="New">New</option>
            <option value="Presentation">Presentation</option>
            <option value="Meeting">Meeting</option>
            <option value="Negotiating">Negotiating</option>
            <option value="Won">Won</option>
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Closing Probability (in %)</FormLabel>
          <Input
            type="number"
            name="probability"
            value={formData.probability}
            onChange={handleChange}
            placeholder="Probability of success"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Deal Amount (Annual)</FormLabel>
          <Input
            type="number"
            name="dealAmount"
            value={formData.dealAmount}
            onChange={handleChange}
            placeholder="Deal Amount"
          />
        </FormControl>
        {/* <FormControl mb={4}>
          <FormLabel>Closing Date</FormLabel>
          <Input
            type="date"
            name="closingDate"
            value={formData.closingDate}
            onChange={handleChange}
          />
        </FormControl> */}
        <Button
          type="submit"
          colorScheme="teal"
          //   isLoading={isLoading}
        >
          Add Opportunity
        </Button>
      </form>
    </Box>
  );
};

export default AddOpportunity;
