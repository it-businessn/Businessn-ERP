import { SimpleGrid } from "@chakra-ui/react";

import useCompany from "hooks/useCompany";
import useSalesAgentData from "hooks/useSalesAgentData";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import ActivityService from "services/ActivityService";
import ContactService from "services/ContactService";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import {
	ACTIVITY_CARDS,
	SALES_ACTIVITY_CARDS,
} from "../customers/contacts/logs/data";
import FilterActivityTab from "./FilterActivityTab";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";
import SelectCustomer from "./SelectCustomer";

const Activities = () => {
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const loggedInUser = LocalStorageService.getItem("user");
	const isManagerRole = isManager(loggedInUser?.role);
	const [contacts, setContacts] = useState(null);
	const [leads, setLeads] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState("Daily");

	const [refresh, setRefresh] = useState(false);
	const [showSelectCustomer, setShowSelectCustomer] = useState(false);
	const [logType, setLogType] = useState(null);
	const [userActivities, setUserActivities] = useState(null);

	const employees = useSalesAgentData(company, false, true);

	const [selectedUser, setSelectedUser] = useState(loggedInUser);

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
		if (showSelectCustomer) {
			fetchAllContacts();
		}
	}, [showSelectCustomer, refresh]);

	useEffect(() => {
		const fetchAllUserActivities = async () => {
			try {
				const response = await ActivityService.getActivitiesByUser({
					id: selectedUser?._id,
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
		fetchAllUserActivities();
	}, [selectedUser, selectedFilter]);

	const handleFilterClick = (filter) => {
		setSelectedFilter(filter);
	};

	const handleChange = (value) => {
		if (value === "") {
			setSelectedUser(loggedInUser);
		} else {
			setSelectedUser(employees.find(({ fullName }) => fullName === value));
		}
	};
	return (
		<PageLayout
			showSelectBox={isManagerRole && employees}
			handleChange={handleChange}
			data={employees}
			selectedValue={selectedUser?.fullName ?? ""}
		>
			<FilterActivityTab
				selectedFilter={selectedFilter}
				handleFilterClick={handleFilterClick}
			/>
			{userActivities && (
				<SimpleGrid
					columns={{ lg: 2 }}
					spacing={4}
					templateColumns={{ lg: "35% 65%" }}
				>
					<LeftPane
						setShowSelectCustomer={setShowSelectCustomer}
						setLogType={setLogType}
					/>
					<RightPane setShowSelectCustomer={setShowSelectCustomer} />
				</SimpleGrid>
			)}

			{showSelectCustomer && (
				<SelectCustomer
					logType={logType}
					showSelectCustomer={showSelectCustomer}
					setRefresh={setRefresh}
					setShowSelectCustomer={setShowSelectCustomer}
					contacts={contacts}
					leads={leads}
					company={company}
					user={loggedInUser}
				/>
			)}
		</PageLayout>
	);
};

export default Activities;
