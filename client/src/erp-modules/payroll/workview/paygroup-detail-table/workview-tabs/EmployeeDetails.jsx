import { HStack } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { COLS } from "constant";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import { useState } from "react";
import SettingService from "services/SettingService";
import AddEmployeeModal from "./AddEmployeeModal";
import WorkviewTab from "./WorkviewTab";

const EmployeeDetails = ({ company, closestRecord, path, groupId, selectedPayGroup }) => {
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const empData = useEmployeeEmploymentInfo(company, null, closestRecord, groupId, refresh);
	const [deletedEmp, setDeletedEmp] = useState(null);

	const [showAddEmp, setShowAddEmp] = useState(false);
	const selectedEmployeeIndex = selectedPayGroup?.yearSchedules[0]?.payPeriods?.findIndex(
		(_) => _?.payPeriod === closestRecord?.payPeriod && _.isExtraRun === true,
	);

	const selectedEmployee =
		selectedPayGroup?.yearSchedules[0]?.payPeriods[selectedEmployeeIndex]?.selectedEmp;

	const handleDelete = () => {
		handleClose();
		selectedPayGroup.yearSchedules[0].payPeriods[selectedEmployeeIndex].selectedEmp =
			selectedEmployee?.filter((_) => _ !== deletedEmp);
	};

	const handleSubmit = async () => {
		try {
			await SettingService.updateGroup({ yearSchedules: selectedPayGroup.yearSchedules }, groupId);
			setRefresh((prev) => !prev);
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};

	const handleClose = () => {
		setShowConfirmationPopUp(!showConfirmationPopUp);
	};

	return (
		<>
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete User"}
					textTitle={"Are you sure you want to remove the user from the extra payrun?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleSubmit}
				/>
			)}
			{showAddEmp && (
				<AddEmployeeModal
					selectedPayGroupId={groupId}
					company={company}
					showAddEmp={showAddEmp}
					setRefresh={setRefresh}
					setShowAddEmp={setShowAddEmp}
					selectedPayGroup={selectedPayGroup}
					selectedEmployee={selectedEmployee}
					selectedEmployeeIndex={selectedEmployeeIndex}
				/>
			)}
			<WorkviewTab
				overflowX="hidden"
				cols={[
					{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
					{ key: "Employee Number", pair: "obj", pair_key: "employeeId" },
					{ key: "Department", pair: "employmentCostCenter" },
					{ key: COLS.PAYRATE, pair: "regPay", round: true },
					// { key: "Employee Department", pair: "companyDepartment" },
					{
						key: "",
						pair: (
							<HStack w={"100%"} justifyContent={"center"}>
								<OutlineButton size="xs" name="setup" label="View Setup" />
								{closestRecord?.isExtraRun && (
									<PrimaryButton name={"Delete"} size="xs" px={0} onOpen={handleDelete} />
								)}
							</HStack>
						),
					},
					{
						key: "detail1",
					},
					{
						key: "detail1s",
					},
					{
						key: "detail2",
					},
					{
						key: "detail3",
					},
					{
						key: "detail4",
					},
					{
						key: "detail5",
					},
					{
						key: "detail6",
					},
					{
						key: "detail7",
					},
					{
						key: "detail8",
					},
				]}
				data={empData}
				label="Setup"
				path={path}
				stepNum={0}
				handleAddEmp={() => setShowAddEmp(true)}
				isExtraRun={closestRecord?.isExtraRun}
				setDeletedEmp={setDeletedEmp}
			/>
		</>
	);
};

export default EmployeeDetails;
