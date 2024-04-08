import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import AgentsView from "./AgentsView";
import ManagerView from "./ManagerView";

const FreshLeads = () => {
	const [leads, setLeads] = useState(null);
	const role = LocalStorageService.getItem("user")?.role;
	const isManager =
		role?.includes("Administrators") || role?.includes("Manager");
	const [isUpdated, setIsUpdated] = useState(false);

	const fetchAllLeads = async () => {
		try {
			const response = await LeadsService.getConfirmedDisbursedLeads();
			response.data.forEach((data) => (data.stage = "L1"));
			setLeads(response.data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchAllLeads();
	}, [isUpdated]);

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Fresh Leads
			</Text>
			{isManager ? (
				<ManagerView leads={leads} />
			) : (
				<AgentsView leads={leads} setIsUpdated={setIsUpdated} />
			)}
		</Box>
	);
};

export default FreshLeads;
