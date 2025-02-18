import { Input } from "@chakra-ui/react";
import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import { useEffect, useState } from "react";
import { timesheetPath } from "routes";
import PayrollService from "services/PayrollService";
import { convertDecimal } from "utils/convertAmt";
import WorkviewTab from "./WorkviewTab";
import {
	MANUAL_PAYOUT_HOURLY_ALLOCATE_COLS,
	PAYOUT_HOURLY_ALLOCATE_COLS,
	REGULAR_HOURLY_ALLOCATE_COLS,
	SUPERFICIAL_HOURLY_ALLOCATE_COLS,
} from "./payrunCols";

const HourlyAllocation = ({ company, closestRecord, groupId, payrunOption }) => {
	const data = useEmployeeHoursWorked(company, closestRecord, groupId, payrunOption);

	const PAYRUN_HOURS_DATA = {
		1: REGULAR_HOURLY_ALLOCATE_COLS,
		2: PAYOUT_HOURLY_ALLOCATE_COLS,
		3: MANUAL_PAYOUT_HOURLY_ALLOCATE_COLS,
		4: SUPERFICIAL_HOURLY_ALLOCATE_COLS,
	};

	const [hourlyAllocatedHours, setHourlyAllocatedHours] = useState(null);

	const [payrunHoursData, setPayrunHoursData] = useState(null);
	const [formData, setFormData] = useState(null);
	const [colKeys, setColKeys] = useState(null);
	const [totalColumnKey, setTotalColumnKey] = useState(null);

	useEffect(() => {
		setPayrunHoursData(PAYRUN_HOURS_DATA[payrunOption]);
	}, [payrunOption]);

	useEffect(() => {
		const allocateColKeys = payrunHoursData?.map(({ pair, key }) =>
			key !== "" && pair !== "obj" ? pair : null,
		);
		setColKeys(allocateColKeys);

		const allocateColMainKey = payrunHoursData?.find(({ isTotal }) => isTotal)?.pair;
		setTotalColumnKey(allocateColMainKey);
	}, [payrunHoursData]);

	useEffect(() => {
		if (data) {
			setHourlyAllocatedHours(data);
		}
	}, [data]);

	const cellClick = (row) => {
		const item = data?.find((record) => record.empId._id === row.empId._id);
		setFormData(item);
	};

	const handleUpdateData = (id, field, value) => {
		const updatedData = hourlyAllocatedHours?.map((record) =>
			record.empId._id === id ? { ...record, [field]: convertDecimal(value) } : record,
		);
		setHourlyAllocatedHours(updatedData);
	};

	const handleSave = async () => {
		try {
			const updatedRec = hourlyAllocatedHours?.find(
				(record) => record.empId._id === formData.empId._id,
			);
			if (updatedRec) {
				updatedRec[totalColumnKey] = 0;
				colKeys.forEach((key) => {
					if (key && key !== totalColumnKey) {
						updatedRec[totalColumnKey] += parseInt(updatedRec[key]);
					}
				});
				updatedRec.companyName = company;
				updatedRec.payPeriodPayDate = closestRecord?.payPeriodPayDate;
				const { data } = await PayrollService.addAdditionalHoursAllocation(updatedRec);
				setFormData(data);
			}
		} catch (error) {}
	};

	const renderEditableInput = (id, field, value) => {
		return (
			<Input
				type="number"
				onBlur={() => handleSave()}
				value={value}
				onChange={(e) => handleUpdateData(id, field, e.target.value)}
				width={"80px"}
				size="sm"
			/>
		);
	};
	return (
		payrunHoursData && (
			<WorkviewTab
				cellClick={cellClick}
				renderEditableInput={renderEditableInput}
				isEditable
				cols={payrunHoursData}
				data={hourlyAllocatedHours}
				label="Setup"
				path={timesheetPath}
			/>
		)
	);
};

export default HourlyAllocation;
