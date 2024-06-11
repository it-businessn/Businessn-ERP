import { Box } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import { FRESH_LEADS } from "../opportunities/data";
import AgentsView from "./AgentsView";

const FreshLeads = () => {
	const [leads, setLeads] = useState(null);
	const [isUpdated, setIsUpdated] = useState(false);
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
	const fetchAllLeads = async () => {
		try {
			const response = await LeadsService.getFreshLeads(company);
			setLeads(response.data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchAllLeads();
	}, [isUpdated, company]);

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<TextTitle title="Fresh Leads" mb={"0.5em"} />
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
