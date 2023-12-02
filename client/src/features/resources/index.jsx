import { Box, Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import {
  FaBook,
  FaCogs,
  FaFileAlt,
  FaGavel,
  FaGraduationCap,
  FaLink,
} from "react-icons/fa";

const ResourceDashboard = () => {
  const resources = [
    {
      id: 1,
      heading: "Forms",
      subheading: "Full library of up-to date legal forms.",
      type: "education",
    },
    {
      id: 2,
      heading: "Education",
      subheading: "Calendar of events.",
      type: "education",
    },
    {
      id: 3,
      heading: "Articles",
      subheading: "Extensive library of issues facing our industry.",
      type: "articles",
    },
    {
      id: 4,
      heading: "Helpful Links",
      subheading: "For quick tips.",
      type: "articles",
    },
    {
      id: 5,
      heading: "Management Handbook",
      subheading: "Comprehensive guide to best practices.",
      type: "helpfulLinks",
    },
    {
      id: 6,
      heading: "Legislation",
      subheading: "Effectively advocating for our members",
      type: "helpfulLinks",
    },
  ];
  const getResourceIcon = (heading) => {
    switch (heading.toLowerCase()) {
      case "forms":
        return <FaFileAlt />;
      case "education":
        return <FaGraduationCap />;
      case "articles":
        return <FaBook />;
      case "helpful links":
        return <FaLink />;
      case "management handbook":
        return <FaCogs />;
      case "legislation":
        return <FaGavel />;
      default:
        return null;
    }
  };
  return (
    <>
      {/* <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </Grid> */}
      <Grid templateColumns="repeat(3, 1fr)" gap={5} mx={2}>
        {resources?.map((resource) => (
          <Box key={resource.id} borderWidth="1px" borderRadius="lg" p={8}>
            <Flex direction="column" align="center" justify="center">
              <Box mb={2} color="blue.500" fontSize="5xl">
                {getResourceIcon(resource.heading)}
              </Box>
              <Heading
                as="h3"
                size="sm"
                mb={2}
                onClick={() => console.log("Clicked!")}
              >
                {resource.heading}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {resource.subheading}
              </Text>
              <Button
                // colorScheme="teal"
                variant="ghost"
                mt={4}
                onClick={() => console.log("Button Clicked!")}
              >
                View Details
              </Button>
            </Flex>
          </Box>
        ))}
      </Grid>
    </>
  );
};

export default ResourceDashboard;
