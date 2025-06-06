import { Box, Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import TextTitle from "components/ui/text/TextTitle";

import DeletePopUp from "components/ui/modal/DeletePopUp";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import AgentsView, { totalLeads } from "../fresh_leads/AgentsView";
import { TARGET_LEADS } from "../opportunities/data";
import GradientAreaFillColorChart from "./AreaFillColorChart";

const Pipeline = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const [leads, setLeads] = useState(null);
	const [isUpdated, setIsUpdated] = useState(false);
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const fetchAllLeads = async () => {
		try {
			const { data } = await LeadsService.getTargetLeads(company);
			setLeads(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllLeads();
	}, [isUpdated, company]);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const handleSubmit = () => {};

	const { fullName, role } = loggedInUser;

	const isUserManager = isManager(role);

	const opportunityData = [
		{
			name: "Meeting Set",
			total: totalLeads("T1", isUserManager, leads, fullName),
		},
		{
			name: "Discovery Call",
			total: totalLeads("T2", isUserManager, leads, fullName),
		},
		{
			name: "Closing",
			total: totalLeads("T3", isUserManager, leads, fullName),
		},
		{
			name: "Onboard",
			total: totalLeads("T4", isUserManager, leads, fullName),
		},
	];

	const handleDelete = async () => {
		try {
			await LeadsService.deleteLead({}, deleteRecord);
			setIsUpdated((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};

	const handleClose = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};

	return (
		<PageLayout title="Target Leads">
			<Box width="100%" borderRadius="10px" border="3px solid var(--main_color)" mb={3}>
				<TextTitle p={"1em"} title="Pipeline" color={"var(--menu_item_color)"} mb={"0.5em"} />

				{opportunityData && <GradientAreaFillColorChart data={opportunityData} />}
			</Box>
			{TARGET_LEADS && (
				<AgentsView
					height="calc(100vh - 538px)"
					leads={leads}
					reference={TARGET_LEADS}
					setIsUpdated={setIsUpdated}
					company={company}
					setShowConfirmationPopUp={setShowConfirmationPopUp}
					setDeleteRecord={setDeleteRecord}
				/>
			)}
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete Target Lead"}
					textTitle={"Are you sure you want to delete the lead?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
			<ModalLayout title={"Edit Lead"} isOpen={isOpen} onClose={onClose}>
				<form onSubmit={handleSubmit}>
					<Stack spacing={4}>
						<InputFormControl
							label={"Name of Company"}
							name="company"
							// valueText={formData?.phoneNo}
							// handleChange={handleChange}
							required
						/>
						<InputFormControl
							type="email"
							label={"Email"}
							name="email"
							// valueText={formData?.phoneNo}
							// handleChange={handleChange}
							required
						/>
						<InputFormControl
							label={"Phone"}
							name="phone"
							// valueText={formData?.phoneNo}
							// handleChange={handleChange}
							required
						/>

						<ActionButtonGroup
							submitBtnName={"Save"}
							// isLoading={isLoading}
							onClose={onClose}
						/>
					</Stack>
				</form>
			</ModalLayout>
		</PageLayout>
	);
};

export default Pipeline;
