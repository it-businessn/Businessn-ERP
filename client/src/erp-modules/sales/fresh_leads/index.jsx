import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import LeadsService from "services/LeadsService";
import { FRESH_LEADS } from "../opportunities/data";
import AgentsView from "./AgentsView";
import ListView from "./ListView";

const FreshLeads = () => {
	const [leads, setLeads] = useState(null);
	const [isUpdated, setIsUpdated] = useState(false);
	const { company } = useCompany();
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

	const handleDelete = async (_id) => {
		try {
			await LeadsService.deleteLead({}, _id);
			setIsUpdated((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};
	const TAB_LIST = [
		{
			id: 0,
			type: "Gridview",
			icon: MdSpaceDashboard,
			name: FRESH_LEADS && (
				<AgentsView
					leads={leads}
					reference={FRESH_LEADS}
					setIsUpdated={setIsUpdated}
					company={company}
					handleDelete={handleDelete}
				/>
			),
		},
		{
			id: 1,
			type: "Listview",
			icon: FaListCheck,
			name: FRESH_LEADS && (
				<ListView
					leads={leads}
					reference={FRESH_LEADS}
					setIsUpdated={setIsUpdated}
					company={company}
					handleDelete={handleDelete}
				/>
			),
		},
	];
	const [viewMode, setViewMode] = useState(TAB_LIST[0].type);
	const showComponent = (viewMode) =>
		TAB_LIST.find(({ type }) => type === viewMode)?.name;
	return (
		<PageLayout title={"Fresh Leads"}>
			<TabsButtonGroup
				tabs={TAB_LIST}
				setViewMode={setViewMode}
				viewMode={viewMode}
			/>
			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default FreshLeads;
