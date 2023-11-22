import { Flex } from "@chakra-ui/react";

import { LandingPageLayout } from "layouts";

const Dashboard = () => {
  return (
    <LandingPageLayout
      headerTitle="Summary"
      content={
        <>
          <Flex flexDir="column">Dashboard content here</Flex>
        </>
      }
    />
  );
};

export default Dashboard;
