import { Input } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeeAmountAllocation from "hooks/useEmployeeAmountAllocation";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import WorkviewTab from "./WorkviewTab";

const AmountAllocation = ({ company, closestRecord, groupId, path }) => {
	const [refresh, setRefresh] = useState(false);
	const data = useEmployeeAmountAllocation(
		company,
		refresh,
		closestRecord,
		groupId,
	);

	const [amountAllocateData, setAmountAllocateData] = useState(null);
	const [formData, setFormData] = useState(null);

	useEffect(() => {
		if (data) {
			setAmountAllocateData(data);
		}
	}, [data]);

	const cellClick = (row) => {
		const item = amountAllocateData?.find(
			(record) => record?.empId?._id === row?.empId?._id,
		);
		setFormData(item);
	};

	const handleUpdateData = (id, field, value) => {
		const updatedData = amountAllocateData?.map((record) =>
			record?.empId?._id === id ? { ...record, [field]: value } : record,
		);
		setAmountAllocateData(updatedData);
	};

	const handleSave = async () => {
		try {
			const updatedRec = amountAllocateData?.find(
				(record) => record?.empId?._id === formData?.empId?._id,
			);
			const {
				commission,
				bonus,
				retroactive,
				reimbursement,
				terminationPayout,
				vacationPayout,
				empId,
			} = updatedRec;

			if (updatedRec) {
				updatedRec.companyName = company;
				await PayrollService.addEmployeeExtraAmount({
					payPeriodPayDate: closestRecord?.payPeriodPayDate,
					companyName: company,
					commission,
					bonus,
					retroactive,
					reimbursement,
					terminationPayout,
					vacationPayout,
					empId,
				});
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
					pair: <OutlineButton size="xs" name="setup" label="View Balances" />,
				},
			]}
			data={amountAllocateData}
			label="Setup"
			path={path}
			stepNum={5}
		/>
	);
};

export default AmountAllocation;
