import { Input } from "@chakra-ui/react";
import useEmployeeAmountAllocation from "hooks/useEmployeeAmountAllocation";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import WorkviewTab from "../WorkviewTab";
import {
	MANUAL_AMT_ALLOCATE_COLS,
	PAYOUT_AMT_ALLOCATE_COLS,
	REGULAR_AMT_ALLOCATE_COLS,
	SUPERFICIAL_AMT_ALLOCATE_COLS,
} from "./payrunAmountAllocationCols.jsx";

const AmountAllocation = ({ company, closestRecord, groupId, payrunOption }) => {
	const [refresh, setRefresh] = useState(false);
	const data = useEmployeeAmountAllocation(company, refresh, closestRecord, groupId, payrunOption);

	const PAYRUN_AMT_ALLOCATE_DATA = {
		1: REGULAR_AMT_ALLOCATE_COLS,
		2: PAYOUT_AMT_ALLOCATE_COLS,
		3: MANUAL_AMT_ALLOCATE_COLS,
		4: SUPERFICIAL_AMT_ALLOCATE_COLS,
	};

	const [payrunAmtData, setPayrunAmtData] = useState(null);
	const [amountAllocateData, setAmountAllocateData] = useState(null);
	const [formData, setFormData] = useState(null);
	const [colKeys, setColKeys] = useState(null);
	const [totalColumnKey, setTotalColumnKey] = useState(null);

	useEffect(() => {
		setPayrunAmtData(PAYRUN_AMT_ALLOCATE_DATA[payrunOption]);
	}, [payrunOption]);

	useEffect(() => {
		const allocateColKeys = payrunAmtData?.map(({ pair, key }) =>
			key !== "" && pair !== "obj" ? pair : null,
		);
		setColKeys(allocateColKeys);

		const allocateColMainKey = payrunAmtData?.find(({ isTotal }) => isTotal)?.pair;
		setTotalColumnKey(allocateColMainKey);
	}, [payrunAmtData]);

	useEffect(() => {
		if (data) {
			setAmountAllocateData(data);
		}
	}, [data]);

	const cellClick = (row) => {
		const item = amountAllocateData?.find((record) => record?.empId?._id === row?.empId?._id);
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
			const { empId } = updatedRec;

			if (updatedRec) {
				updatedRec[totalColumnKey] = 0;
				colKeys.forEach((key) => {
					if (key && key !== totalColumnKey) {
						updatedRec[totalColumnKey] += parseFloat(updatedRec[key]);
					}
				});
				updatedRec.companyName = company;
				const { data } = await PayrollService.addEmployeeExtraAmount({
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
				cellClick={cellClick}
				renderEditableInput={renderEditableInput}
				isEditable
				setRefresh={setRefresh}
				cols={payrunAmtData}
				data={amountAllocateData}
				label="Setup"
			/>
		)
	);
};

export default AmountAllocation;
