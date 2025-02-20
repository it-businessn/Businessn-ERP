import { Input } from "@chakra-ui/react";
import useEmployeeEEContribution from "hooks/useEmployeeEEContribution";
import { useEffect, useState } from "react";
import WorkviewTab from "../WorkviewTab";
import {
	MANUAL_EE_COLS,
	PAYOUT_EE_COLS,
	REGULAR_EE_COLS,
	SUPERFICIAL_EE_COLS,
} from "./payrunEEContrCols";

const EmployeeContribution = ({ company, closestRecord, groupId, payrunOption }) => {
	const [refresh, setRefresh] = useState(false);
	const data = useEmployeeEEContribution(company, closestRecord, groupId, payrunOption);
	const EE_CONTRIBUTION_COL_DATA = {
		1: REGULAR_EE_COLS,
		2: PAYOUT_EE_COLS,
		3: MANUAL_EE_COLS,
		4: SUPERFICIAL_EE_COLS,
	};
	const [payrunAmtData, setPayrunAmtData] = useState(null);
	const [contributionData, setContributionData] = useState(null);
	const [formData, setFormData] = useState(null);

	useEffect(() => {
		setPayrunAmtData(EE_CONTRIBUTION_COL_DATA[payrunOption]);
	}, [payrunOption]);

	useEffect(() => {
		if (data) {
			setContributionData(data);
		}
	}, [data]);

	const cellClick = (row) => {
		const item = contributionData?.find((record) => record?.empId?._id === row?.empId?._id);
		setFormData(item);
	};
	const handleUpdateData = (id, field, value) => {
		const updatedData = contributionData?.map((record) =>
			record?.empId?._id === id ? { ...record, [field]: value } : record,
		);
		setContributionData(updatedData);
	};

	const handleSave = async () => {
		try {
			const updatedRec = contributionData?.find(
				(record) => record?.empId?._id === formData?.empId?._id,
			);
			const { empId } = updatedRec;

			if (updatedRec) {
				// updatedRec[totalColumnKey] = 0;
				// colKeys.forEach((key) => {
				// 	if (key && key !== totalColumnKey) {
				// 		updatedRec[totalColumnKey] += parseFloat(updatedRec[key]);
				// 	}
				// });
				updatedRec.companyName = company;
				// const { data } = await PayrollService.addEmployeeExtraAmount({
				// 	payPeriodPayDate: closestRecord?.payPeriodPayDate,
				// 	companyName: company,
				// 	updatedRec,
				// 	empId,
				// });
				// setRefresh((prev) => !prev);
				// setFormData(data);
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
		payrunAmtData && (
			<WorkviewTab
				overflowX="hidden"
				cols={payrunAmtData}
				data={contributionData}
				cellClick={cellClick}
				renderEditableInput={renderEditableInput}
				isEditable
				setRefresh={setRefresh}
			/>
		)
	);
};

export default EmployeeContribution;
