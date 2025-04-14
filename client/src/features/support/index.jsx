import { Box, Center, Circle, Flex, HStack, SimpleGrid, Text } from "@chakra-ui/react";

import PrimaryButton from "components/ui/button/PrimaryButton";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useBreakpointValue } from "services/Breakpoint";
import CompanyInfo from "./CompanyInfo";
import ContactInfo from "./ContactInfo";
import QueryInfo from "./QueryInfo";

const Support = () => {
	const handleNext = (id) => setViewMode(SETUP_LIST[id]?.type);
	const handlePrev = (id) => setViewMode(SETUP_LIST[id - 2]?.type);
	const { isMobile, isIpad } = useBreakpointValue();
	const SETUP_LIST = [
		{
			id: 0,
			type: "Company Details",
			name: <CompanyInfo isIpad={isIpad} id={1} handleNext={handleNext} />,
		},
		{
			id: 1,
			type: "Contact Details",
			name: <ContactInfo id={2} handleNext={handleNext} handlePrev={handlePrev} />,
		},
		{
			id: 2,
			type: "Explain the Issue",
			name: <QueryInfo id={3} handleNext={handleNext} handlePrev={handlePrev} />,
		},
	];
	const [tabs, setTabs] = useState(SETUP_LIST);
	const tabContent = SETUP_LIST[0]?.type;
	const [viewMode, setViewMode] = useState(tabContent);

	const currentTab = tabs.find(({ type }) => type === viewMode)?.id;

	const showComponent = (viewMode) => tabs.find(({ type }) => type === viewMode)?.name;

	const [activeStep, setActiveStep] = useState(0);

	const handleNextS = () => {
		if (activeStep < SETUP_LIST.length - 1) {
			setActiveStep(activeStep + 1);
		}
	};

	const handleBack = () => {
		if (activeStep > 0) setActiveStep(activeStep - 1);
	};

	useEffect(() => {
		setViewMode(SETUP_LIST[activeStep].type);
	}, [activeStep]);

	return (
		<Box h={"100vh"} overflow="auto">
			<Center pos="sticky" background="white" top={0} zIndex={1}>
				<a href="/" aria-current="page" className="main-logo w-inline-block w--current">
					<img
						src="https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo.png"
						loading="lazy"
						sizes="(max-width: 479px) 50vw, (max-width: 767px) 180px, (max-width: 991px) 23vw, 213px"
						srcSet="https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo-p-500.png 500w, https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo-p-800.png 800w, https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo.png 852w"
						alt="main-logo"
					/>
				</a>
			</Center>
			{isMobile ? (
				<Box
					pos="relative"
					zIndex={0}
					w="100%"
					maxW="800px"
					mx="auto"
					py={6}
					padding={"24px"}
					backgroundColor="var(--main_color)"
				>
					<TextTitle align="center" title="Need Support? Let Us Help" />
					<Flex
						pt={6}
						px={4}
						direction={isMobile ? "column" : "row"}
						gap={isMobile ? 4 : 8}
						align={isMobile ? "flex-start" : "center"}
						justify="space-between"
					>
						{SETUP_LIST.map((label, index) => (
							<Flex
								key={index}
								direction="column"
								align="center"
								position="relative"
								w={isMobile ? "100%" : "auto"}
								onClick={() => {
									setActiveStep(label?.id);
								}}
							>
								<Circle
									size="2.3em"
									bg={index === activeStep ? "var(--banner_bg)" : "var(--calendar_border)"}
									color={"white"}
									fontWeight="bold"
									zIndex={1}
								>
									{index + 1}
								</Circle>
								<Text
									mt={2}
									textAlign="center"
									fontSize="sm"
									fontWeight={index === activeStep ? "semibold" : "normal"}
								>
									{label?.type}
								</Text>
							</Flex>
						))}
					</Flex>
					{showComponent(viewMode)}
					<Flex gap={3} justify="end">
						<PrimaryButton
							name="Back"
							onOpen={handleBack}
							isDisabled={activeStep === 0}
							bg="var(--lead_cards_border)"
						/>
						<PrimaryButton
							name="Next"
							onOpen={handleNextS}
							isDisabled={activeStep === SETUP_LIST.length - 1}
							bg="var(--banner_bg)"
						/>
					</Flex>
				</Box>
			) : (
				<Box
					w={{ base: "100%", md: "80%", lg: "70%" }}
					py="2em"
					m="0 auto"
					padding={"24px"}
					backgroundColor="var(--main_color)"
				>
					<PageLayout title="Need Support? Let Us Help">
						<HStack spacing="1em" justifyContent={"space-between"}>
							<SimpleGrid
								columns={{ base: 3 }}
								spacing="1em"
								bg={"var(--primary_bg)"}
								borderRadius={"20px"}
								w={"100%"}
								my="5"
							>
								{tabs?.map((_) => (
									<RadioButtonGroup
										key={_?.id}
										name={_?.type}
										selectedFilter={viewMode}
										handleFilterClick={(name) => setViewMode(name)}
										fontSize={"1em"}
										rightIcon={<FaCheckCircle color={_?.id <= currentTab ? "green" : "grey"} />}
									/>
								))}
							</SimpleGrid>
						</HStack>
						{showComponent(viewMode)}
					</PageLayout>
				</Box>
			)}
		</Box>
	);
};

export default Support;
