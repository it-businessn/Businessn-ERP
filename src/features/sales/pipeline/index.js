import {
  Box,
  Grid,
  GridItem,
  Text,
  Card,
  CardBody,
  Flex,
  Badge,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { DashboardLayout } from "layouts";
import GradientAreaFillColorChart from "./AreaFillColorChart";
import { userCurrency } from "utils";

const categories = [
  {
    type: "New",
    color: "#64a7dc",
    name: "New",
    opportunities: [
      {
        opportunityName: "New Opportunity 1",
        projectName: "Project A",
        category: "New",
        probability: "3%",
        dealAmount: 50000,
      },
      {
        opportunityName: "New Opportunity 2",
        projectName: "Project B",
        category: "New",
        probability: "4%",
        dealAmount: 60000,
      },
      {
        opportunityName: "New Opportunity 3",
        projectName: "Project C",
        category: "New",
        probability: "2%",
        dealAmount: 45000,
      },
      {
        opportunityName: "New Opportunity 4",
        projectName: "Project D",
        category: "New",
        probability: "3%",
        dealAmount: 52000,
      },
      {
        opportunityName: "New Opportunity 5",
        projectName: "Project E",
        category: "New",
        probability: "7%",
        dealAmount: 70000,
      },
    ],
  },
  {
    type: "Presentations",
    color: "#fdb206",
    name: "Presentations",
    opportunities: [
      {
        opportunityName: "Presenting Opportunity 1",
        projectName: "Project X",
        category: "Presenting",
        probability: "5%",
        dealAmount: 75000,
      },
      {
        opportunityName: "Presenting Opportunity 2",
        projectName: "Project Y",
        category: "Presenting",
        probability: "1%",
        dealAmount: 80000,
      },
      {
        opportunityName: "Presenting Opportunity 3",
        projectName: "Project Z",
        category: "Presenting",
        probability: "7%",
        dealAmount: 90000,
      },
      {
        opportunityName: "Presenting Opportunity 4",
        projectName: "Project W",
        category: "Presenting",
        probability: "33%",
        dealAmount: 95000,
      },
      {
        opportunityName: "Presenting Opportunity 5",
        projectName: "Project V",
        category: "Presenting",
        probability: "5%",
        dealAmount: 82000,
      },
    ],
  },
  {
    type: "Meeting",
    color: "#fa005a",
    name: "Meeting",
    opportunities: [
      {
        opportunityName: "Meeting Opportunity 1",
        projectName: "Project M",
        category: "Meeting",
        probability: "3%",
        dealAmount: 100000,
      },
      {
        opportunityName: "Meeting Opportunity 2",
        projectName: "Project N",
        category: "Meeting",
        probability: "4%",
        dealAmount: 95000,
      },
      {
        opportunityName: "Meeting Opportunity 3",
        projectName: "Project O",
        category: "Meeting",
        probability: "7%",
        dealAmount: 110000,
      },
      {
        opportunityName: "Meeting Opportunity 4",
        projectName: "Project P",
        category: "Meeting",
        probability: "1%",
        dealAmount: 120000,
      },
      {
        opportunityName: "Meeting Opportunity 5",
        projectName: "Project Q",
        category: "Meeting",
        probability: "1%",
        dealAmount: 102000,
      },
    ],
  },
  {
    type: "Negotiating",
    color: "#f88c00",
    name: "Negotiating",
    opportunities: [
      {
        opportunityName: "Negotiating Opportunity 1",
        projectName: "Project I",
        category: "Negotiating",
        probability: "1%",
        dealAmount: 120000,
      },
      {
        opportunityName: "Negotiating Opportunity 2",
        projectName: "Project J",
        category: "Negotiating",
        probability: "2%",
        dealAmount: 110000,
      },
      {
        opportunityName: "Negotiating Opportunity 3",
        projectName: "Project K",
        category: "Negotiating",
        probability: "25%",
        dealAmount: 130000,
      },
      {
        opportunityName: "Negotiating Opportunity 4",
        projectName: "Project L",
        category: "Negotiating",
        probability: "85%",
        dealAmount: 115000,
      },
      {
        opportunityName: "Negotiating Opportunity 5",
        projectName: "Project M",
        category: "Negotiating",
        probability: "88%",
        dealAmount: 118000,
      },
    ],
  },
  {
    type: "Won",
    color: "#69cb36",
    name: "Won",
    opportunities: [
      {
        opportunityName: "Won Opportunity 1",
        projectName: "Project W",
        category: "Won",
        probability: "1%",
        dealAmount: 150000,
      },
      {
        opportunityName: "Won Opportunity 2",
        projectName: "Project X",
        category: "Won",
        probability: "8%",
        dealAmount: 155000,
      },
      {
        opportunityName: "Won Opportunity 3",
        projectName: "Project Y",
        category: "Won",
        probability: "100%",
        dealAmount: 160000,
      },
      {
        opportunityName: "Won Opportunity 4",
        projectName: "Project Z",
        category: "Won",
        probability: "88%",
        dealAmount: 170000,
      },
      {
        opportunityName: "Won Opportunity 5",
        projectName: "Project V",
        category: "Won",
        probability: "13%",
        dealAmount: 180000,
      },
    ],
  },
];

const Pipeline = () => {
  return (
    <DashboardLayout>
      <Box width="100%">
        <GradientAreaFillColorChart />
        <Grid templateColumns="repeat(5, 1fr)" mx={5}>
          {categories.map((item, columnIndex) => (
            <GridItem key={columnIndex}>
              <Box
                height="50px"
                bg={item.color}
                borderRadius="md"
                marginBottom="2"
              >
                <Text color="#fff" p={2.1} px={5}>
                  {item.name}
                  <Text fontSize="xs" color="#fff">
                    {item.opportunities.length} records
                  </Text>
                </Text>
                {item.opportunities.map((opportunity) => (
                  <Card mt={2} mx={2.5}>
                    <CardBody p={2}>
                      <Flex>
                        <Stack>
                          <Text
                            fontWeight="medium"
                            fontSize="sm"
                            textTransform="capitalize"
                          >
                            {opportunity.opportunityName}
                          </Text>
                          <Text color="muted" fontSize="sm">
                            {opportunity.projectName}
                          </Text>
                          <HStack>
                            <Text color="muted" fontSize="xs">
                              Probability:
                            </Text>
                            <Badge colorScheme="teal" fontSize="0.8em" mr={2}>
                              {opportunity.probability}
                            </Badge>
                          </HStack>
                          <HStack>
                            <Text color="muted" fontSize="xs">
                              Deal Amount:
                            </Text>
                            <Text color="muted" fontSize="xs" fontWeight="bold">
                              {userCurrency("CAD").format(
                                opportunity.dealAmount
                              )}
                            </Text>
                          </HStack>
                        </Stack>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Pipeline;
