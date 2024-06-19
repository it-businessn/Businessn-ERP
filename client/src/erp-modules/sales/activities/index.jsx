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
import { useEffect, useState } from "react";
import { RiAspectRatioLine } from "react-icons/ri";
import ActivityService from "services/ActivityService";
import { useBreakpointValue } from "services/Breakpoint";
import ContactService from "services/ContactService";
import LocalStorageService from "services/LocalStorageService";
import {
	ACTIVITY_CARDS,
	SALES_ACTIVITY_CARDS,
} from "../customers/contacts/logs/data";
import Activity from "./Activity";
import Contest from "./Contest";
import GaugeChartComponent from "./GaugeChart";
import SelectCustomer from "./SelectCustomer";

const Activities = () => {
	const { isMobile, isIpad } = useBreakpointValue();
	const [contacts, setContacts] = useState(null);
	const [leads, setLeads] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState("Daily");

	const [refresh, setRefresh] = useState(false);
	const [showSelectCustomer, setShowSelectCustomer] = useState(false);
	const [logType, setLogType] = useState(null);
	const [userActivities, setUserActivities] = useState(null);
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);
	const user = LocalStorageService.getItem("user");

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

		const fetchAllUserActivities = async () => {
			try {
				const response = await ActivityService.getActivitiesByUser({
					id: user?._id,
					company,
					type: selectedFilter,
				});
				setUserActivities(response.data);

				const isToday = selectedFilter === "Daily";
				const isWeekly = selectedFilter === "Weekly";
				const isMonthly = selectedFilter === "Monthly";
				const isQuarterly = selectedFilter === "Quarterly";
				const isAnnual = selectedFilter === "Annual";

				ACTIVITY_CARDS.map((item) => {
					item.count = response.data.filter(
						(_) => _.type === item.value,
					).length;
					const target = item.target;
					item.target1 = isWeekly
						? target * 5
						: isMonthly
						? target * 20
						: isQuarterly
						? target * 60
						: isAnnual
						? target * 240
						: target;
					return item;
				});
				SALES_ACTIVITY_CARDS.map((_) => {
					_.count = response.data.filter((_) => _.type === _.value).length;
					const target = _.target;
					_.target2 = isWeekly
						? target * 5
						: isMonthly
						? target * 20
						: isQuarterly
						? target * 60
						: isAnnual
						? target * 240
						: target;
					return _;
				});
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllContacts();
		fetchAllUserActivities();
	}, [company, refresh, selectedFilter]);

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
			{userActivities && (
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
								target={activity.target1}
								width={{ base: "50%", md: "40%", lg: "40%", xl: "40%" }}
								onClick={() => {
									setLogType(activity.value);
									setShowSelectCustomer(true);
								}}
							/>
						))}
					</SimpleGrid>

					{showSelectCustomer && (
						<SelectCustomer
							logType={logType}
							showSelectCustomer={showSelectCustomer}
							setRefresh={setRefresh}
							setShowSelectCustomer={setShowSelectCustomer}
							contacts={contacts}
							leads={leads}
							company={company}
							user={user}
						/>
					)}

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
								target={activity.target2}
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
			)}
		</Box>
	);
};

export default Activities;
