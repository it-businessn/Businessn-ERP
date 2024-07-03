import { Box, HStack, Icon, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { FaSortDown } from "react-icons/fa6";
import { MdOutlineChevronRight } from "react-icons/md";
import VerticalStepper from "./dashboard/leftpane/VerticalStepper";

const ProcessPayroll = () => {
	const steps = [
		{ title: "Payrun Setup", content: "Payrun Setup content" },
		{ title: "Inputs Review", content: "Inputs Review" },
		{ title: "Alerts and Violations", content: "" },
		{ title: "Review Reports", content: "" },
		{ title: "Finalize", content: "" },
		{ title: "Payroll Complete", content: "" },
	];
	const [currentStep, setCurrentStep] = useState(0);
	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				my="4"
				mr="4"
				templateColumns={{ lg: "20% 80%" }}
			>
				<Box
					color={"brand.nav_color"}
					p="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
				>
					<TextTitle title={"Process payroll"} mt={2} mb={"1em"} />
					<VStack spacing={3} align={"start"}>
						<HStack spacing={2}>
							<TextTitle
								weight="normal"
								color={"var(--primary_button_bg)"}
								title={"Manage all payrolls"}
								width="auto"
							/>
							<Icon
								borderRadius={"50%"}
								as={MdOutlineChevronRight}
								// onClick={() => handleChangeDate("prev")}
								boxSize="5"
								color="var(--primary_button_bg)"
							/>
						</HStack>
						<VerticalStepper
							hideProgress
							steps={steps}
							currentStep={currentStep}
							height="70vh"
						/>
						<PrimaryButton
							minW={"100%"}
							isDisabled={currentStep !== steps.length}
							name={"Submit payroll"}
							// isLoading={isLoading}
							loadingText="Loading"
						/>
					</VStack>
				</Box>
				<Box
					color={"brand.nav_color"}
					p="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
				>
					<HStack spacing={2} align={"center"}>
						<Icon
							as={FaSortDown}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
						<TextTitle
							mt={1}
							weight="normal"
							title={steps[currentStep].title}
						/>
					</HStack>

					{steps[currentStep]?.content}
				</Box>
			</SimpleGrid>
		</Box>
	);
};

export default ProcessPayroll;
