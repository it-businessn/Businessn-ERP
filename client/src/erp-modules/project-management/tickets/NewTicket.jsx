import {
  Stack,
  useDisclosure,
  Box,
  HStack,
  Divider,
  Badge,
  Text,
  FormHelperText,
  VStack,
  Grid,
  GridItem,
  Icon,
  Tooltip,
  Progress,
  FormLabel,
  Input,
  Flex,
  useColorModeValue,
  FormControl,
} from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import TicketService from "services/TicketService";
import { AttachmentIcon } from "@chakra-ui/icons";
import { MdPriorityHigh } from "react-icons/md";
import { BsPersonFill, BsFileEarmarkText } from "react-icons/bs";
import { FaTicketAlt } from "react-icons/fa";
import PrimaryButton from "components/ui/button/PrimaryButton";
import CancelButton from "components/ui/button/CancelButton";

const NewTicket = ({
  showAddEntry,
  setShowAddEntry,
  setRefresh,
  company,
  userId,
  employees,
  depts,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");
  const accentColor = useColorModeValue(
    "var(--primary_button_bg)",
    "var(--primary_button_bg_dark)"
  );
  // Using an extremely light shade of #371f37 (deep purple), almost white
  const leftColumnBg = useColorModeValue("#fdfbfd", "#4a2d4a");
  const labelFontWeight = "bold";

  const initialFormData = {
    category: "",
    priority: "medium", // Default to medium priority
    companyName: company,
    assignee: "",
    topic: "",
    issue: "",
    originator: userId,
    file: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Basic file validation
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setFileError("File size must be less than 10MB");
        return;
      }
      setFileError("");
    }

    setFormData((prevData) => ({ ...prevData, file }));
  };

  const { onClose } = useDisclosure();

  const handleClose = () => {
    onClose();
    reset();
  };

  const reset = () => {
    setShowAddEntry(false);
    setFormData(initialFormData);
    setFileError("");
  };

  const handleSubmit = async () => {
    if (fileError) return;

    const { category, priority, companyName, assignee, topic, issue, originator, file } = formData;
    const ticketData = new FormData();
    ticketData.append("category", category);
    ticketData.append("companyName", companyName);
    ticketData.append("assignee", assignee);
    ticketData.append("priority", priority);
    ticketData.append("topic", topic);
    ticketData.append("issue", issue);
    ticketData.append("originator", originator);
    ticketData.append("file", file);

    setIsSubmitting(true);
    try {
      await TicketService.addInfo(ticketData);
      setRefresh((prev) => !prev);
      handleClose();
    } catch (error) {
      console.log("An error occurred. Please try again.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalLayout
      title={
        <HStack spacing={2}>
          <Icon as={FaTicketAlt} color={accentColor} />
          <Text>Create New Ticket</Text>
        </HStack>
      }
      size="3xl"
      isOpen={showAddEntry}
      onClose={handleClose}
    >
      <Box mb={4}>
        <Text fontSize="sm" color="gray.600">
          Create a new support ticket to track issues, bugs, or feature requests.
        </Text>
      </Box>
      <Divider mb={4} />

      <Grid templateColumns={{ base: "1fr", md: "1fr 4fr" }} gap={6}>
        <GridItem
          bg={leftColumnBg}
          p={4}
          borderRadius="md"
          boxShadow="0 4px 12px rgba(55, 31, 55, 0.15)"
          position="relative"
          zIndex="1"
          borderWidth="1px"
          borderColor="purple.100"
        >
          <VStack align="stretch" spacing={4}>
            <Box>
              <HStack mb={3}>
                <Icon as={BsPersonFill} color={accentColor} />
                <Text fontWeight="bold" fontSize="md">
                  Assignment Information
                </Text>
              </HStack>

              <SelectFormControl
                valueParam="name"
                name="category"
                label="Department/Category"
                valueText={formData.category}
                handleChange={handleChange}
                options={depts}
                placeholder="Select department"
                required
                size="md"
              />

              <Box mt={5}>
                <FormControl>
                  <FormLabel htmlFor="priority" fontWeight={labelFontWeight}>
                    Priority Level
                  </FormLabel>
                  <HStack spacing={3} mt={2}>
                    <Badge
                      colorScheme="green"
                      px={3}
                      py={1}
                      borderRadius="full"
                      cursor="pointer"
                      onClick={() => setFormData((prev) => ({ ...prev, priority: "low" }))}
                      boxShadow={formData.priority === "low" ? "0 0 0 1px green" : "none"}
                      opacity={formData.priority === "low" ? 1 : 0.7}
                      fontWeight="normal"
                      fontSize="xs"
                      textTransform="lowercase"
                      letterSpacing="0.2px"
                      border="1px solid"
                      borderColor={formData.priority === "low" ? "green.300" : "transparent"}
                    >
                      low
                    </Badge>
                    <Badge
                      colorScheme="orange"
                      px={3}
                      py={1}
                      borderRadius="full"
                      cursor="pointer"
                      onClick={() => setFormData((prev) => ({ ...prev, priority: "medium" }))}
                      boxShadow={formData.priority === "medium" ? "0 0 0 1px orange" : "none"}
                      opacity={formData.priority === "medium" ? 1 : 0.7}
                      fontWeight="normal"
                      fontSize="xs"
                      textTransform="lowercase"
                      letterSpacing="0.2px"
                      border="1px solid"
                      borderColor={formData.priority === "medium" ? "orange.300" : "transparent"}
                    >
                      medium
                    </Badge>
                    <Badge
                      colorScheme="red"
                      px={3}
                      py={1}
                      borderRadius="full"
                      cursor="pointer"
                      onClick={() => setFormData((prev) => ({ ...prev, priority: "high" }))}
                      boxShadow={formData.priority === "high" ? "0 0 0 1px red" : "none"}
                      opacity={formData.priority === "high" ? 1 : 0.7}
                      fontWeight="normal"
                      fontSize="xs"
                      textTransform="lowercase"
                      letterSpacing="0.2px"
                      border="1px solid"
                      borderColor={formData.priority === "high" ? "red.300" : "transparent"}
                    >
                      high
                    </Badge>
                  </HStack>
                </FormControl>
              </Box>

              <Box mt={5}>
                <SelectFormControl
                  valueParam="_id"
                  name="fullName"
                  label="Assignee"
                  valueText={formData.assignee}
                  handleChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      assignee: e.target.value,
                    }))
                  }
                  options={employees}
                  placeholder="Select assignee"
                  required
                  size="md"
                />
              </Box>
            </Box>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Box>
              <HStack mb={3}>
                <Icon as={BsFileEarmarkText} color={accentColor} />
                <Text fontWeight="bold" fontSize="md">
                  Ticket Details
                </Text>
              </HStack>

              <InputFormControl
                maxLength={100}
                label="Topic/Subject"
                name="topic"
                valueText={formData.topic}
                handleChange={handleChange}
                required
                placeholder="Brief summary of the issue"
                size="md"
              />

              <TextAreaFormControl
                maxLength={500}
                label="Description"
                name="issue"
                valueText={formData.issue}
                handleChange={handleChange}
                required
                rows={6}
              />

              <Box mt={5}>
                <FormControl>
                  <FormLabel fontWeight={labelFontWeight}>File/Attachment</FormLabel>
                  <Flex
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    borderColor={formData.file ? "green.400" : "gray.200"}
                    direction="column"
                  >
                    <Input
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                      p={1}
                      border="none"
                    />
                    {formData.file && (
                      <HStack mt={2} fontSize="sm" color="green.600">
                        <AttachmentIcon />
                        <Text>{formData.file.name}</Text>
                      </HStack>
                    )}
                    {fileError && <FormHelperText color="red.500">{fileError}</FormHelperText>}
                    <FormHelperText>Attach any relevant files (max 10MB)</FormHelperText>
                  </Flex>
                </FormControl>
              </Box>
            </Box>
          </VStack>
        </GridItem>
      </Grid>

      <Divider my={6} />

      <HStack justifyContent="center" spacing={4}>
        <PrimaryButton
          size="md"
          isDisabled={
            formData.assignee === "" ||
            formData.topic === "" ||
            formData.issue === "" ||
            formData.category === "" ||
            fileError !== ""
          }
          name="Create Ticket"
          isLoading={isSubmitting}
          loadingText="Loading"
          onOpen={handleSubmit}
          bg="#371f37"
        />
        <CancelButton name="Cancel" onClick={handleClose} size="md" />
      </HStack>
    </ModalLayout>
  );
};

export default NewTicket;
