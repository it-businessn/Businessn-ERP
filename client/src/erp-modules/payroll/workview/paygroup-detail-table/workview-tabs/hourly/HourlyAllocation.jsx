import { EditableInputControl } from "erp-modules/payroll/controls/EditableInputControl";
import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import { useEffect, useState } from "react";
import { timesheetPath } from "routes";
import PayrollService from "services/PayrollService";
import { convertDecimal } from "utils/convertAmt";
import WorkviewTab from "../WorkviewTab";
import {
	MANUAL_PAYOUT_HOURLY_ALLOCATE_COLS,
	PAYOUT_HOURLY_ALLOCATE_COLS,
	REGULAR_HOURLY_ALLOCATE_COLS,
	SUPERFICIAL_HOURLY_ALLOCATE_COLS,
} from "./payrunHourlyAllocationCols";

const HourlyAllocation = ({
	company,
	closestRecord,
	groupId,
	payrunOption,
	deptName,
	selectedPayGroupOption,
}) => {
	const hourlyAllocationData = useEmployeeHoursWorked(
		company,
		closestRecord,
		groupId,
		payrunOption,
		deptName,
		selectedPayGroupOption,
	);

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
		if (hourlyAllocationData) {
			hourlyAllocationData.map((hrs) => {
				hrs.totalRegHoursWorked = convertDecimal(hrs?.totalRegHoursWorked);
				hrs.totalSickHoursWorked = convertDecimal(hrs?.totalSickHoursWorked);
				hrs.totalStatDayHoursWorked = convertDecimal(hrs?.totalStatDayHoursWorked);
				hrs.totalStatHours = convertDecimal(hrs?.totalStatHours);
				hrs.totalVacationHoursWorked = convertDecimal(hrs?.totalVacationHoursWorked);
				hrs.totalBereavementHoursWorked = convertDecimal(hrs?.totalBereavementHoursWorked);
				hrs.totalPersonalDayHoursWorked = convertDecimal(hrs?.totalPersonalDayHoursWorked);
				hrs.additionalDblOvertimeHoursWorked = convertDecimal(
					hrs?.additionalDblOvertimeHoursWorked,
				);
				hrs.additionalRegHoursWorked = convertDecimal(hrs?.additionalRegHoursWorked);
				hrs.additionalRegHoursWorked2 = convertDecimal(hrs?.additionalRegHoursWorked2);
				hrs.additionalSickHoursWorked = convertDecimal(hrs?.additionalSickHoursWorked);
				hrs.additionalStatDayHoursWorked = convertDecimal(hrs?.additionalStatDayHoursWorked);
				hrs.additionalStatHoursWorked = convertDecimal(hrs?.additionalStatHoursWorked);
				hrs.additionalVacationHoursWorked = convertDecimal(hrs?.additionalVacationHoursWorked);
				hrs.totalDblOvertimeHoursWorked = convertDecimal(hrs?.totalDblOvertimeHoursWorked);
				hrs.totalOvertimeHoursWorked = convertDecimal(hrs?.totalOvertimeHoursWorked);

				hrs.totalHoursWorked = convertDecimal(hrs?.totalHoursWorked);
				hrs.totalSuperficialHoursWorked = convertDecimal(hrs?.totalSuperficialHoursWorked);
				hrs.totalManualHoursWorked = convertDecimal(hrs?.totalManualHoursWorked);
				hrs.totalPayoutHoursWorked = convertDecimal(hrs?.totalPayoutHoursWorked);

				return hrs;
			});
			setHourlyAllocatedHours(hourlyAllocationData);
		}
	}, [hourlyAllocationData]);

	const cellClick = (row) => {
		const item = hourlyAllocationData?.find((record) => record.empId._id === row.empId._id);
		setFormData(item);
	};

	const handleUpdateData = (id, field, value) => {
		const updatedData = hourlyAllocatedHours?.map((record) =>
			record.empId._id === id ? { ...record, [field]: value } : record,
		);
		setHourlyAllocatedHours(updatedData);
		handleSave(updatedData);
	};

	const handleSave = async (hourlyAllocatedHours) => {
		try {
			const updatedRec = hourlyAllocatedHours?.find(
				(record) => record.empId._id === formData?.empId._id,
			);
			if (updatedRec) {
				updatedRec[totalColumnKey] = 0;
				colKeys.forEach((key) => {
					if (key && key !== totalColumnKey && updatedRec[key]) {
						updatedRec[totalColumnKey] += parseFloat(updatedRec[key]);
					}
				});
				updatedRec.companyName = company;
				updatedRec.payPeriodPayDate = closestRecord?.payPeriodPayDate;
				const { data } = await PayrollService.addAdditionalHoursAllocation(updatedRec);
				setFormData(data);
			}
		} catch (error) {}
	};

	const renderEditableInput = (id, field, value) => (
		<EditableInputControl
			value={value}
			onSave={(nextValue) => handleUpdateData(id, field, nextValue)}
		/>
	);

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
