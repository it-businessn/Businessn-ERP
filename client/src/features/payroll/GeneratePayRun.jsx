import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";

const GeneratePayRun = () => {
  const sampleData = {
    payPeriodNumber: "123",
    runType: "regular",
    paymentDate: "2023-01-15",
    payPeriodEndDate: "2023-01-31",
    emailNotification: true,
    statementMessage: "Thank you for your hard work!",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //  logic to generate payrun here
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Generate Payrun</Heading>
      <form onSubmit={handleSubmit}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <Flex>
            <Text textAlign="left">Pay Period Number:</Text>
            <Text textAlign="right">{sampleData.payPeriodNumber}</Text>
          </Flex>

          <Flex>
            <Text textAlign="left">Run Type:</Text>
            <Text textAlign="right">{sampleData.runType}</Text>
          </Flex>

          <Flex>
            <Text textAlign="left">Payment Date:</Text>
            <Text textAlign="right">{sampleData.paymentDate}</Text>
          </Flex>

          <Flex>
            <Text textAlign="left">Pay Period End Date:</Text>
            <Text textAlign="right">{sampleData.payPeriodEndDate}</Text>
          </Flex>

          <Flex>
            <Text textAlign="left">Enable Email Notification on Payday:</Text>
            <Text textAlign="right">
              {sampleData.emailNotification ? "Yes" : "No"}
            </Text>
          </Flex>

          <Flex>
            <Text textAlign="left">Statement Message to All Employees:</Text>
            <Text textAlign="right">{sampleData.statementMessage}</Text>
          </Flex>
        </Grid>

        <Flex mt={4}>
          <Spacer />
          {/* The button is disabled for a read-only form */}
          <Button type="submit" colorScheme="teal" isDisabled>
            Schedule to Pay
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default GeneratePayRun;
