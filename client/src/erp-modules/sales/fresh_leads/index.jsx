import DeletePopUp from "components/ui/modal/DeletePopUp";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import { FRESH_LEADS } from "../opportunities/data";
import AgentsView from "./AgentsView";
import ListView from "./ListView";

const FreshLeads = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const [leads, setLeads] = useState(null);
	const [isUpdated, setIsUpdated] = useState(false);

	const fetchAllLeads = async () => {
		try {
			const { data } = await LeadsService.getFreshLeads(company);
			setLeads(data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchAllLeads();
	}, [isUpdated, company]);

	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const handleDelete = async () => {
		try {
			await LeadsService.deleteLead({}, deleteRecord);
			setIsUpdated((prev) => !prev);
			setShowConfirmationPopUp((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};
	const handleClose = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};

	const TAB_LIST = [
		{
			id: 0,
			type: "Gridview",
			icon: MdSpaceDashboard,
			name: FRESH_LEADS && (
				<AgentsView
					height="calc(100vh - 260px)"
					leads={leads}
					reference={FRESH_LEADS}
					setIsUpdated={setIsUpdated}
					company={company}
					setShowConfirmationPopUp={setShowConfirmationPopUp}
					setDeleteRecord={setDeleteRecord}
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
					setShowConfirmationPopUp={setShowConfirmationPopUp}
					setDeleteRecord={setDeleteRecord}
				/>
			),
		},
	];
	const [viewMode, setViewMode] = useState(TAB_LIST[0].type);
	const showComponent = (viewMode) => TAB_LIST.find(({ type }) => type === viewMode)?.name;
	return (
		<PageLayout title="Fresh Leads">
			<TabsButtonGroup tabs={TAB_LIST} setViewMode={setViewMode} viewMode={viewMode} />
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete Fresh Lead"}
					textTitle={"Are you sure you want to delete the lead?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default FreshLeads;
