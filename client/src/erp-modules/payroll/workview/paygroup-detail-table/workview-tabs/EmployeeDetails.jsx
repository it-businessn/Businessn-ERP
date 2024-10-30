import { HStack } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import { useState } from "react";
import SettingService from "services/SettingService";
import AddEmployeeModal from "./AddEmployeeModal";
import WorkviewTab from "./WorkviewTab";

const EmployeeDetails = ({
	company,
	closestRecord,
	path,
	groupId,
	selectedPayGroup,
}) => {
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const empData = useEmployeeEmploymentInfo(
		company,
		null,
		closestRecord,
		groupId,
		refresh,
	);

	const handleClose = () => setShowConfirmationPopUp(false);

	const [showAddEmp, setShowAddEmp] = useState(false);
	const selectedEmployeeIndex = selectedPayGroup?.scheduleSettings?.findIndex(
		(_) => _.payPeriod === closestRecord.payPeriod && _.isExtraRun === true,
	);

	const selectedEmployee =
		selectedPayGroup?.scheduleSettings[selectedEmployeeIndex]?.selectedEmp;

	const handleDelete = (emp) => {
		setShowConfirmationPopUp(true);
		selectedPayGroup.scheduleSettings[selectedEmployeeIndex].selectedEmp =
			selectedEmployee?.filter((_) => _ !== emp);
	};

	const handleSubmit = async () => {
		try {
			await SettingService.updateGroup(
				{ scheduleSettings: selectedPayGroup.scheduleSettings },
				groupId,
			);
			setRefresh((prev) => !prev);
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.");
		}
	};

	return (
		<>
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete User"}
					textTitle={
						"Are you sure you want to remove the user from the extra payrun?"
					}
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
				cols={[
					{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
					{ key: "Employee Number", pair: "obj", pair_key: "employeeId" },
					{ key: "Payrate", pair: "regPay", round: true },
					{ key: "Employee Department", pair: "companyDepartment" },
					{ key: "Employee Cost Center", pair: "employmentCostCenter" },
					{
						key: "",
						pair: (
							<HStack w={"100%"} justifyContent={"center"}>
								<OutlineButton size="xs" name="setup" label="View Setup" />
								{closestRecord?.isExtraRun && (
									<PrimaryButton name={"Delete"} size="xs" px={0} />
								)}
							</HStack>
						),
					},
					{
						key: "detail1",
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
				handleDelete={handleDelete}
				setShowConfirmationPopUp={setShowConfirmationPopUp}
			/>
		</>
	);
};

export default EmployeeDetails;
