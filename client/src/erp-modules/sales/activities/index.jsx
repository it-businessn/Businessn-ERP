import {
	Box,
	Flex,
	HStack,
	Icon,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import HighlightButton from "components/ui/button/HighlightButton";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import { ACTIVITY_CARDS, SALES_ACTIVITY_CARDS } from "constant";
import { useEffect, useState } from "react";
import { RiAspectRatioLine } from "react-icons/ri";
import { useBreakpointValue } from "services/Breakpoint";
import ContactService from "services/ContactService";
import LocalStorageService from "services/LocalStorageService";
import Activity from "./Activity";
import Contest from "./Contest";
import GaugeChartComponent from "./GaugeChart";
import SelectCustomer from "./SelectCustomer";

const Activities = () => {
	const { isMobile, isIpad } = useBreakpointValue();
	const [contacts, setContacts] = useState(null);
	const [leads, setLeads] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState("monthly");
	const [refresh, setRefresh] = useState(false);
	const [showSelectCustomer, setShowSelectCustomer] = useState(false);
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);

	useEffect(() => {
		const handleSelectedCompanyChange = (event) => setCompany(event.detail);

		document.addEventListener(
			"selectedCompanyChanged",
			handleSelectedCompanyChange,
		);

		return () => {
			document.removeEventListener(
				"selectedCompanyChanged",
				handleSelectedCompanyChange,
			);
		};
	}, []);
	useEffect(() => {
		const fetchAllContacts = async () => {
			try {
				const response = await ContactService.getCompContacts(company);
				response.data.map((_) => (_.stage = _.leadId?.stage));
				const filterContacts = response.data.filter((_) => _.stage === "T4");
				const filterLeads = response.data.filter((_) => _.stage?.includes("L"));
				setLeads(filterLeads);
				setContacts(filterContacts);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllContacts();
	}, [company]);

	const handleFilterClick = (filter) => {
		setSelectedFilter(filter);
	};
	return (
		<Box p={{ base: "1em", md: "2em" }}>
			{isMobile || isIpad ? (
				<SimpleGrid
					columns={{ base: 3, md: 5 }}
					spacing="1em"
					my="5"
					bg={"brand.100"}
					borderRadius={"20px"}
					p={"8px"}
				>
					<RadioButtonGroup
						data={["Daily", "Weekly", "Monthly", "Quarterly", "Annual"]}
						selectedFilter={selectedFilter}
						handleFilterClick={handleFilterClick}
					/>
				</SimpleGrid>
			) : (
				<SimpleGrid columns={{ base: 5, lg: 2 }} spacing="1em" my="5">
					<Flex gap="2em" bg={"brand.100"} borderRadius={"20px"} p={"8px"}>
						<RadioButtonGroup
							data={["Daily", "Weekly", "Monthly", "Quarterly", "Annual"]}
							selectedFilter={selectedFilter}
							handleFilterClick={handleFilterClick}
						/>
					</Flex>
				</SimpleGrid>
			)}
			<SimpleGrid
				columns={{ lg: 2 }}
				spacing={4}
				templateColumns={{ lg: "35% 65%" }}
			>
				<SimpleGrid
					columns={1}
					spacing={4}
					templateRows={{ lg: "1% 8% 8% 8% 8% 8% 8%" }}
				>
					<Text fontWeight="bold">Activities</Text>
					{ACTIVITY_CARDS.map((activity) => (
						<Activity
							activity={activity}
							key={activity.title}
							width={{ base: "50%", md: "40%", lg: "40%", xl: "40%" }}
							onClick={() => setShowSelectCustomer(true)}
						/>
					))}
				</SimpleGrid>

				<SelectCustomer
					showSelectCustomer={showSelectCustomer}
					setRefresh={setRefresh}
					setShowSelectCustomer={setShowSelectCustomer}
					contacts={contacts}
					leads={leads}
					company={company}
				/>

				<SimpleGrid
					columns={1}
					spacing={4}
					templateRows={{ lg: "1% 8% 8% 12%" }}
				>
					<Text fontWeight="bold">Sales</Text>
					{SALES_ACTIVITY_CARDS.map((activity) => (
						<Activity
							activity={activity}
							key={activity.title}
							onClick={() => setShowSelectCustomer(true)}
							width={{ base: "50%", md: "40%", lg: "20%", xl: "20%" }}
						/>
					))}
					<Box
						p="0.5em 1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
						justifyContent="space-between"
						display="flex"
						flexDir={"column"}
					>
						<HStack spacing={0}>
							<VStack alignItems="self-start" spacing={0}>
								<Icon as={RiAspectRatioLine} color={"grey"} boxSize={8} />
								<TextTitle title={"Sales Target"} size={"sm"} />
								<HighlightButton name={"Process new sale"} />
							</VStack>
							<Box
								mt={3}
								mx={"auto"}
								w={{ base: "50%", md: "80%", lg: "80%", xl: "100%" }}
							>
								{/* <GaugeChartComponent value={70} maxValue={100} /> */}
								<GaugeChartComponent value={0} maxValue={100} />
							</Box>
						</HStack>
					</Box>

					<Contest />
				</SimpleGrid>
			</SimpleGrid>
		</Box>
	);
};

export default Activities;
