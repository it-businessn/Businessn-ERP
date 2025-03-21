import { Input } from "@chakra-ui/react";
import useEmployeeEEContribution from "hooks/useEmployeeEEContribution";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import WorkviewTab from "../WorkviewTab";
import {
	MANUAL_EE_COLS,
	PAYOUT_EE_COLS,
	REGULAR_EE_COLS,
	SUPERFICIAL_EE_COLS,
} from "./payrunEEContrCols";

const EmployeeContribution = ({
	company,
	closestRecord,
	groupId,
	payrunOption,
	path,
	deptName,
}) => {
	const [refresh, setRefresh] = useState(false);
	const data = useEmployeeEEContribution(company, closestRecord, groupId, payrunOption, deptName);

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
				updatedRec.companyName = company;
				const { data } = await PayrollService.addEmployeeContribution({
					payPeriodPayDate: closestRecord?.payPeriodPayDate,
					companyName: company,
					updatedRec,
					empId,
				});
				setRefresh((prev) => !prev);
				setFormData(data);
			}
		} catch (error) {}
	};

	const renderEditableInput = (id, field, value) => (
		<Input
			type="number"
			onBlur={() => handleSave()}
			value={value || ""}
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
				isEditable={payrunOption === "4"}
				setRefresh={setRefresh}
				path={path}
				stepNum={3}
			/>
		)
	);
};

export default EmployeeContribution;
