import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LeadsService from "services/LeadsService";
import { FRESH_LEADS } from "../opportunities/data";
import AgentsView from "./AgentsView";

const FreshLeads = () => {
	const [leads, setLeads] = useState(null);
	const [isUpdated, setIsUpdated] = useState(false);

	const fetchAllLeads = async () => {
		try {
			const response = await LeadsService.getConfirmedDisbursedLeads();
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
			{FRESH_LEADS && (
				<AgentsView
					leads={leads}
					reference={FRESH_LEADS}
					setIsUpdated={setIsUpdated}
				/>
			)}
		</Box>
	);
};

export default FreshLeads;
