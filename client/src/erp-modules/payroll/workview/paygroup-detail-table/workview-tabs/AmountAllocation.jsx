import { Input } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeePayInfo from "hooks/useEmployeePayInfo";
import { useEffect, useState } from "react";
import { ROUTE_PATH } from "routes";
import PayrollService from "services/PayrollService";
import WorkviewTab from "./WorkviewTab";

const AmountAllocation = ({ company, closestRecord, groupId }) => {
	const [refresh, setRefresh] = useState(false);
	const data = useEmployeePayInfo(
		company,
		refresh,
		null,
		closestRecord,
		groupId,
	);

	const [amountAllocateData, setAmountAllocateData] = useState([]);
	const [formData, setFormData] = useState(null);

	useEffect(() => {
		if (data) {
			setAmountAllocateData(data);
		}
	}, [data]);

	const cellClick = (row) => {
		const item = amountAllocateData?.find((record) => record._id === row._id);
		setFormData(item);
	};

	const handleUpdateData = (id, field, value) => {
		const updatedData = amountAllocateData.map((record) =>
			record._id === id ? { ...record, [field]: value } : record,
		);
		setAmountAllocateData(updatedData);
	};

	const handleSave = async () => {
		try {
			const updatedRec = amountAllocateData.find(
				(record) => record._id === formData._id,
			);
			if (updatedRec) {
				await PayrollService.updateEmployeeAmountAllocation(
					updatedRec,
					updatedRec._id,
				);
				setRefresh((prev) => !prev);
				setFormData(null);
			}
		} catch (error) {}
	};

	const renderEditableInput = (id, field, value) => (
		<Input
			type="number"
			onBlur={() => handleSave()}
			value={value}
			onChange={(e) => handleUpdateData(id, field, e.target.value)}
			placeholder="0"
			size="sm"
		/>
	);

	return (
		<WorkviewTab
			cellClick={cellClick}
			renderEditableInput={renderEditableInput}
			isEditable
			setRefresh={setRefresh}
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				{ key: "Commission $", pair: "commission", isEditable: true },
				{ key: "Retroactive $", pair: "retroactive", isEditable: true },
				{ key: "Reimbursement $", pair: "reimbursement", isEditable: true },
				{
					key: "Vacation Payout $",
					pair: "vacationPayout",
					isEditable: true,
				},
				{ key: "Bonus $", pair: "bonus", isEditable: true },
				{
					key: "Termination Payout $",
					pair: "terminationPayout",
					isEditable: true,
				},
				{
					key: "",
					pair: <OutlineButton name="setup" label="View Balances" size="sm" />,
				},
			]}
			data={amountAllocateData}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}`}
			stepNum={5}
		/>
	);
};

export default AmountAllocation;
