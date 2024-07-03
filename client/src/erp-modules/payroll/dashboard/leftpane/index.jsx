import { Box, HStack, Icon, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";

import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import VerticalStepper from "./VerticalStepper";

const LeftPane = ({ selectedPayGroup, setStats, company }) => {
	const steps = [
		{ title: "Approvals", description: "Contact Info" },
		{ title: "Leave Adjustment", description: "Date & Time" },
		{ title: "New Employees", description: "Select Employees" },
		{ title: "Termination", description: "" },
		{ title: "Alerts and Violations", description: "" },
		{ title: "Review Reports", description: "" },
		{ title: "Submit", description: "" },
	];
	const [currentStep, setCurrentStep] = useState(0);

	const goToNextStep = () => {
		setCurrentStep((prevStep) => prevStep + 1);
	};
	const sections = [
		{
			name: "Payroll",
			content: (
				<>
					<HStack gap={4} justifyContent={"space-around"}>
						<VStack
							spacing={0}
							color={"brand.nav_color"}
							p="1em"
							w={"100%"}
							bg={"brand.primary_bg"}
							border="3px solid var(--main_color)"
							borderRadius="10px"
						>
							<TextTitle title={"Feb"} align={"center"} />
							<TextTitle title={"2024"} align={"center"} />
						</VStack>
						<VStack
							spacing={0}
							color={"var(--lead_cards_bg)"}
							p="1em"
							w={"100%"}
							bg={"var(--payroll_bg)"}
							border="3px solid var(--payroll_bg)"
							borderRadius="10px"
						>
							<TextTitle title={"PP 26"} mt={2} align={"center"} />
							<TextTitle title={"March 2024"} align={"center"} />
							<TextTitle
								title={"Run date: 19/03/24"}
								align={"center"}
								size="xs"
								mb={"1em"}
							/>
						</VStack>
						<VStack
							spacing={0}
							color={"brand.nav_color"}
							p="1em"
							w={"100%"}
							bg={"brand.primary_bg"}
							border="3px solid var(--main_color)"
							borderRadius="10px"
						>
							<TextTitle title={"Apr"} align={"center"} />
							<TextTitle title={"2024"} align={"center"} />
						</VStack>
					</HStack>
					<HStack gap={4}>
						<VStack
							spacing={0}
							color={"brand.nav_color"}
							p="1em"
							w={"100%"}
							bg={"brand.primary_bg"}
							border="3px solid var(--main_color)"
							borderRadius="10px"
						>
							<TextTitle title={"Check date"} />
							<TextTitle title={"2024"} />
						</VStack>
						<VStack
							spacing={0}
							color={"brand.nav_color"}
							p="1em"
							w={"100%"}
							bg={"brand.primary_bg"}
							border="3px solid var(--main_color)"
							borderRadius="10px"
						>
							<TextTitle title={"Pay period"} />
							<TextTitle title={"19/03 - 30/05"} />
						</VStack>
					</HStack>
					<PrimaryButton
						minW={"100%"}
						// isDisabled={isDisabled}
						name={"Run payroll"}
						// isLoading={isLoading}
						loadingText="Loading"
					/>
				</>
			),
		},
		{
			name: "Pay period",
			content: (
				<>
					<VStack spacing={3} alignItems={"start"}>
						<HStack
							w={"100%"}
							justifyContent={"space-between"}
							alignItems={"start"}
						>
							<TextTitle title={"Employees"} />
							<VStack>
								<TextTitle align="end" title={"March 2024 (03/2024)"} />
								<TextTitle align="end" weight="normal" title={"0 Payslips"} />
							</VStack>
						</HStack>
						<HStack
							w={"100%"}
							justifyContent={"space-between"}
							alignItems={"start"}
						>
							<TextTitle title={"Vacations"} />
							<VStack>
								<TextTitle align="end" title={"March 2024 (03/2024)"} />
								<TextTitle align="end" weight="normal" title={"0 Payslips"} />
							</VStack>
						</HStack>
					</VStack>
				</>
			),
		},
		{
			name: "Payroll actions",
			content: (
				<>
					<VStack spacing={3} alignItems={"start"}>
						<HStack
							w={"100%"}
							justifyContent={"space-between"}
							color={"brand.nav_color"}
							px="1em"
							bg={"var(--bg_color_1)"}
							border="3px solid var(--bg_color_1)"
							borderRadius="10px"
						>
							<VStack>
								<TextTitle title={"Overview of payroll process"} />
								<TextTitle
									weight="normal"
									title={"Task progress of 200 employees"}
								/>
							</VStack>
							<TextTitle
								title={"45%"}
								align="end"
								color={"var(--primary_button_bg)"}
							/>
						</HStack>
						<VerticalStepper steps={steps} currentStep={currentStep} />
					</VStack>
				</>
			),
		},
		{
			name: "Notifications",
			content: (
				<>
					<VStack spacing={3} alignItems={"start"}>
						<VStack spacing={1}>
							<TextTitle title={"Next public holiday"} />
							<TextTitle weight="normal" title={"Sunday - Jul 4, 2024"} />
						</VStack>
						<VStack spacing={1}>
							<TextTitle title={"Next public holiday"} />
							<TextTitle weight="normal" title={"Sunday - Jul 4, 2024"} />
						</VStack>
						<VStack spacing={1}>
							<TextTitle title={"Next public holiday"} />
							<TextTitle weight="normal" title={"Sunday - Jul 4, 2024"} />
						</VStack>
					</VStack>
				</>
			),
		},
	];
	return (
		<Box>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 2 }}
				spacing="1em"
				color={"brand.200"}
			>
				{/* <TimeCard selectedUser={selectedUser} company={company} /> */}

				{sections.map(({ name, content }, index) => (
					<Box
						key={name}
						color={"brand.nav_color"}
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
					>
						{index === 0 ? (
							<HStack>
								<TextTitle title={name} mt={2} mb={"1em"} />
								<HStack spacing={0}>
									<Icon
										borderRadius={"50%"}
										as={MdOutlineChevronLeft}
										// onClick={() => handleChangeDate("prev")}
										boxSize="5"
										color="fg.muted"
									/>

									<Icon
										as={MdOutlineChevronRight}
										// onClick={() => handleChangeDate("next")}
										boxSize="5"
										color="fg.muted"
									/>
								</HStack>
							</HStack>
						) : (
							<TextTitle title={name} mt={2} mb={"1em"} />
						)}

						{content}
					</Box>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
