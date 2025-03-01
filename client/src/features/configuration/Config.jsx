import { Box, Collapse, Grid, GridItem, Heading, useDisclosure, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import useManager from "hooks/useManager";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import CompaniesPanel from "../setup/company/CompaniesPanel";
import AddNewGroup from "../setup/company/group-tab/AddNewGroup";

const Configuration = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const managers = useManager(company);
	const [modules, setModules] = useState(null);

	// const [darkMode, setDarkMode] = useState(false);
	// const [fontSize, setFontSize] = useState(16);
	// const [themeColor, setThemeColor] = useState("blue");

	const CONFIG_OPTIONS = [
		{
			name: `Company Details`,
			title: "Manage Companies",
			content: <CompaniesPanel setOpenCompanyForm={true} />,
		},
		{
			name: "Add Module",
			title: "Manage Modules",
			content: <AddNewGroup company={company} modules={modules} managers={managers} />,
		},
		{
			name: "Add Role",
			title: "Manage Role",
			content: <CompaniesPanel setOpenCompanyForm />,
		},
		{
			name: "Add Paygroup",
			title: "Manage Paygroup",
			content: <CompaniesPanel setOpenCompanyForm />,
		},
		{
			name: "Add Department",
			title: "Manage Department",
			content: <CompaniesPanel setOpenCompanyForm />,
		},
		{
			name: "Add Stat Holidays",
			title: "Manage Stat Holidays",
			content: <CompaniesPanel setOpenCompanyForm />,
		},
	];

	useEffect(() => {
		const fetchAllModules = async () => {
			try {
				const { data } = await SettingService.getAllModules(company);
				setModules(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllModules();
	}, []);

	const { isOpen, onToggle } = useDisclosure();
	const [currentSection, setCurrentSection] = useState(null);
	return (
		<PageLayout
			width="full"
			title={<Heading pb={1}>{`Configuration for ${company}`}</Heading>}
			showBgLayer
		>
			<Box
				// p={5}
				// bg={darkMode ? "gray.800" : "gray.100"}
				// color={darkMode ? "white" : "black"}
				minH="100vh"
			>
				{/* <VStack spacing={5}>
					<FormControl display="flex" alignItems="center">
						<FormLabel mb="0">Dark Mode</FormLabel>
						<Switch isChecked={darkMode} onChange={() => setDarkMode(!darkMode)} />
					</FormControl>
					<FormControl>
						<FormLabel>Font Size</FormLabel>
						<Slider min={12} max={30} value={fontSize} onChange={(val) => setFontSize(val)}>
							<SliderTrack>
								<SliderFilledTrack />
							</SliderTrack>
							<SliderThumb />
						</Slider>
						<Box mt={2} fontSize={`${fontSize}px`}>
							Sample Text
						</Box>
					</FormControl>
					<FormControl>
						<FormLabel>Theme Color</FormLabel>
						<Select value={themeColor} onChange={(e) => setThemeColor(e.target.value)}>
							<option value="blue">Blue</option>
							<option value="red">Red</option>
							<option value="green">Green</option>
							<option value="purple">Purple</option>
						</Select>
					</FormControl></VStack> */}
				<Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
					{CONFIG_OPTIONS.map(({ title, name }, index) => (
						<GridItem borderColor="gray.300" key={name}>
							<VStack spacing={4} p={5} boxShadow="md" borderRadius="lg" borderColor="red">
								<TextTitle title={title} align="center" />
								<PrimaryButton
									size="xs"
									name={name}
									onOpen={() => {
										console.log(index, CONFIG_OPTIONS[0].content);
										setCurrentSection(index);
										onToggle();
									}}
								/>
							</VStack>

							<Collapse in={isOpen}>
								{currentSection !== null && (
									<Box width="100%" borderWidth={1} p={5} borderRadius="md">
										{CONFIG_OPTIONS[currentSection].content}
									</Box>
								)}
							</Collapse>
						</GridItem>
					))}
				</Grid>
			</Box>
		</PageLayout>
	);
};

export default Configuration;
