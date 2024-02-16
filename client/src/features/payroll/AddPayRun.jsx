import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

const AddPayrun = () => {
  const initialData = {
    payPeriodNumber: "123",
    runType: "regular",
    paymentDate: "2023-01-15",
    payPeriodEndDate: "2023-01-31",
    emailNotification: true,
    statementMessage: "Thank you for your hard work!",
  };

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    setEditing(false);
    //  logic to save the edited data
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Generate Payrun</Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        {Object.entries(formData).map(([key, value]) => (
          <Flex key={key}>
            <Text textAlign="left">{key}:</Text>
            {editing ? (
              <Input
                textAlign="right"
                value={value}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
              />
            ) : (
              <Text textAlign="right">{value}</Text>
            )}
            {key !== "emailNotification" && (
              <Button
                variant="link"
                ml={2}
                size="sm"
                onClick={editing ? handleSaveClick : handleEditClick}
              >
                {editing ? "Save" : "Edit"}
              </Button>
            )}
          </Flex>
        ))}
      </Grid>

      <Flex mt={4}>
        <Spacer />
        <Button
          type="submit"
          colorScheme="teal"
          isDisabled={editing}
          onClick={handleSaveClick}
        >
          Schedule to Pay
        </Button>
      </Flex>
    </Box>
  );
};

export default AddPayrun;
