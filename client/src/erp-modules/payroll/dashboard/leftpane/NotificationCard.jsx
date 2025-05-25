import { Box, HStack, Image, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import scheduler from "../../../../assets/Scheduler.png";

const NotificationCard = () => {
  return (
    <BoxCard bg={"white"}>
      <VStack spacing={4} alignItems={"start"} w={"100%"}>
        <HStack spacing={4} justifyContent={"space-between"} w={"100%"} zIndex={2}>
          <PrimaryButton
            minW={"20%"}
            name={"New Feature"}
            loadingText="Loading"
            bg="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
          />
          <Box>
            <TextTitle
              size={"xl"}
              fontWeight="bold"
              color={"var(--banner_bg)"}
              title={"AI Scheduler"}
              _hover={{ transform: "scale(1.02)" }}
              transition="all 0.2s"
            />
          </Box>
        </HStack>
        <NormalTextTitle
          title={"Automate manual scheduling processes with AI powered scheduling tools."}
          size="sm"
          whiteSpace={"wrap"}
          zIndex={2}
          color="gray.600"
        />
        <Image
          objectFit="contain"
          height={"40%"}
          w={"40%"}
          src={scheduler}
          alt="AI Scheduler illustration"
          transition="transform 0.3s ease-in-out"
          _hover={{ transform: "scale(1.05)" }}
        />
        <HStack w="100%" justifyContent="flex-end">
          <PrimaryButton
            name="Learn more"
            variant="solid"
            bg="var(--banner_bg)"
            color="white"
            size="sm"
            rightIcon={
              <Box as="span" fontSize="lg">
                →
              </Box>
            }
            _hover={{
              transform: "translateX(4px)",
              opacity: 0.9,
            }}
            transition="all 0.2s"
            zIndex={2}
          />
        </HStack>
      </VStack>
    </BoxCard>
  );
};

export default NotificationCard;
