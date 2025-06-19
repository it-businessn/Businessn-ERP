import { HStack, useDisclosure } from "@chakra-ui/react";

import { Button, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "@chakra-ui/react";
import { tabStyleCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useState } from "react";

import {
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import MasterUserInfo from "erp-modules/sales/onboarding/MasterUserInfo";
import MasterUserModules from "erp-modules/sales/onboarding/MasterUserModules";
import useModule from "hooks/useModule";
import { FaChevronLeft, FaChevronRight, FaSave, FaUserPlus } from "react-icons/fa";
import UserService from "services/UserService";

const OnboardUserModal = ({ showOnboard, setShowOnboard, title, company }) => {
	const toast = useToast();
	const { onClose } = useDisclosure();
	const modules = useModule(company);
	const defaultInfo = {
		personalInfo: {
			company,
			firstName: "",
			middleName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			position: "",
			startDate: null,
		},
		moduleInfo: {
			selectedPermissions: [],
		},
	};
	const [tabIndex, setTabIndex] = useState(0);
	const [formData, setFormData] = useState(defaultInfo);

	const handleClose = () => {
		onClose();
		setShowOnboard(false);
	};

	const ONBOARD_TABS = [
		{
			name: "Personal Info",
			content: <MasterUserInfo formData={formData} setFormData={setFormData} />,
		},
		{
			name: "Module Access",
			content: (
				<MasterUserModules formData={formData} setFormData={setFormData} modules={modules} />
			),
		},
	];

	const isLastStep = tabIndex === ONBOARD_TABS.length - 1;

	const handleSubmit = async () => {
		try {
			const { data } = await UserService.addMasterUser(formData);
			toast({
				title: "Action successful!",
				description: "New user created successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
			handleClose();
		} catch (error) {
			toast({
				title: "Something went wrong.",
				description: "Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};
	const getNextButtonIcon = () => {
		if (tabIndex === ONBOARD_TABS.length - 1) {
			return <FaSave />;
		}
		return <FaChevronRight />;
	};
	const getNextButtonAction = () => {
		if (isLastStep) {
			handleSubmit();
		} else {
			setTabIndex(tabIndex + 1);
		}
	};

	return (
		<Modal
			isOpen={showOnboard}
			onClose={handleClose}
			size="5xl"
			isCentered
			motionPreset="slideInBottom"
		>
			<ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(8px)" />
			<ModalContent
				height="700px"
				maxH="80vh"
				borderRadius="lg"
				boxShadow="2xl"
				display="flex"
				flexDirection="column"
			>
				<ModalHeader
					bg="var(--banner_bg)"
					color="white"
					borderTopRadius="lg"
					py={5}
					position="relative"
					flexShrink={0}
				>
					<Flex align="center" gap={3} fontSize="xl">
						<FaUserPlus />
						<TextTitle title="Add New User" />
					</Flex>
					<ModalCloseButton
						top="16px"
						right="16px"
						bg="rgba(255, 255, 255, 0.1)"
						borderRadius="full"
						_hover={{
							bg: "rgba(255, 255, 255, 0.2)",
							transform: "scale(1.1)",
						}}
						_active={{
							bg: "rgba(255, 255, 255, 0.3)",
						}}
						aria-label="Close modal"
						title="Close"
						zIndex="10"
					/>
				</ModalHeader>
				<ModalBody p={0} flex="1" overflow="hidden" display="flex" flexDirection="column">
					<Tabs
						index={tabIndex}
						onChange={setTabIndex}
						variant="enclosed"
						colorScheme="purple"
						display="flex"
						flexDirection="column"
						sx={tabStyleCss}
						height="100%"
					>
						<TabList bg="gray.50" px={{ base: 0, md: 6 }} pt={5} pb={2} flexShrink={0}>
							{ONBOARD_TABS.map(({ name }) => (
								<Tab
									key={name}
									fontWeight="semibold"
									_selected={{ color: "white", bg: "var(--banner_bg)" }}
								>
									{name}
								</Tab>
							))}
						</TabList>

						<TabPanels flex="1" overflow="hidden">
							{ONBOARD_TABS.map(({ name, content }, i) => (
								<TabPanel key={`${name}_content_${i}`}>{content}</TabPanel>
							))}
						</TabPanels>
					</Tabs>
				</ModalBody>
				<ModalFooter bg="gray.50" borderBottomRadius="lg" py={5} flexShrink={0}>
					<HStack spacing={4}>
						{tabIndex > 0 && (
							<Button
								leftIcon={<FaChevronLeft />}
								onClick={() => setTabIndex(tabIndex - 1)}
								colorScheme="gray"
								variant="outline"
								px={6}
							>
								Back
							</Button>
						)}

						<Button
							rightIcon={getNextButtonIcon()}
							onClick={getNextButtonAction}
							bg={"var(--banner_bg)"}
							color="white"
							_hover={{ bg: "#4a2b4a" }}
							px={6}
						>
							{tabIndex === 0 ? "Next" : "Save"}
						</Button>

						<Button
							onClick={handleClose}
							variant="ghost"
							px={6}
							color="gray.600"
							_hover={{ bg: "gray.100" }}
						>
							Cancel
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default OnboardUserModal;
