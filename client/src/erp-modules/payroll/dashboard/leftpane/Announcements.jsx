import { Box, Stack, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import moment from "moment";
import { useEffect, useState } from "react";
import CommunicationService from "services/CommsService";

// SUPPORT-01: the server returns the general Support notices plus this
// company's own announcements; each is shown with its own text (the text used
// to be hard-coded by position, so a title could show another notice's text).
const messageLines = (message) =>
  String(message || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const Announcements = ({ company }) => {
  const [announcements, setAnnouncements] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await CommunicationService.getAnnouncement(company);
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    if (company) fetchAnnouncements();
  }, [company]);

  return (
    <Stack
      spacing={"3em"}
      alignItems="start"
      justifyContent="start"
      position="relative"
      zIndex={1}
      justify="space-between"
      align="center"
      p={{ base: "1.5em", md: "4em" }}
      color="white"
      // when the panes stack (below xl) a near-full-height support panel
      // pushed the payroll cards off screen; cap it instead
      height={{ base: "45vh", xl: "calc(95vh - 145px)" }}
      overflowY={"auto"}
      css={tabScrollCss}
    >
      <VStack css={tabScrollCss} spacing={4} alignItems="start" w="100%">
        {announcements?.map(({ title, message, createdOn, _id }) => (
          <Box key={_id} w={{ base: "100%", md: "70%" }}>
            <Box
              borderRadius="lg"
              bg={"var(--receiver_msg_bg)"}
              color={"black"}
              px={3}
              py={1.5}
              justifyContent={"flex-start"}
            >
              <VStack alignItems={"self-start"} spacing={0}>
                <TextTitle
                  title="Support Assistant"
                  size="xs"
                  whiteSpace="wrap"
                />
                <NormalTextTitle title={title} size="xs" whiteSpace="wrap" />
                {messageLines(message).map((line, i) => (
                  <NormalTextTitle
                    key={`${_id}_${i}`}
                    whiteSpace="pre-wrap"
                    title={line}
                    size="xs"
                  />
                ))}
              </VStack>
            </Box>

            <NormalTextTitle title={moment(createdOn).fromNow()} size="xs" />
          </Box>
        ))}
      </VStack>
    </Stack>
  );
};

export default Announcements;
