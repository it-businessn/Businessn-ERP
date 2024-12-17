import { Box, Center, HStack, SimpleGrid } from "@chakra-ui/react";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import CompanyInfo from "./CompanyInfo";
import ContactInfo from "./ContactInfo";
import QueryInfo from "./QueryInfo";

const Support = () => {
	const handleNext = (id) => setViewMode(SETUP_LIST[id]?.type);
	const handlePrev = (id) => setViewMode(SETUP_LIST[id - 2]?.type);
	const SETUP_LIST = [
		{
			id: 0,
			type: "Company Details",

			name: <CompanyInfo id={1} handleNext={handleNext} />,
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

	return (
		<Box padding={"24px"} backgroundColor="var(--main_color)" h={"100vh"}>
			<Center>
				<a href="/" aria-current="page" className="main-logo w-inline-block w--current">
					<img
						src="https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo.png"
						loading="lazy"
						sizes="(max-width: 479px) 100vw, (max-width: 767px) 180px, (max-width: 991px) 23vw, 213px"
						srcSet="https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo-p-500.png 500w, https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo-p-800.png 800w, https://cdn.prod.website-files.com/66d2b99c721c32f423762484/66dade9174eaeb438087f3ff_logo.png 852w"
						alt="main-logo"
					/>
				</a>
			</Center>
			<Box w={"100%"} p={"0 25em"}>
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
		</Box>
	);
};

export default Support;
