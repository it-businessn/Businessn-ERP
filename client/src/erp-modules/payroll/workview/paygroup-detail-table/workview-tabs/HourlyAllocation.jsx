import { Input } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import { useEffect, useState } from "react";
import { timesheetPath } from "routes";
import PayrollService from "services/PayrollService";
import { convertDecimal } from "utils/convertAmt";
import WorkviewTab from "./WorkviewTab";

const HourlyAllocation = ({ company, closestRecord, groupId }) => {
	const data = useEmployeeHoursWorked(company, closestRecord, groupId);

	const [hourlyAllocatedHours, setHourlyAllocatedHours] = useState(null);
	const HOURLY_ALLOCATE_COLS = [
		{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
		{ key: "Total Hours", pair: "totalHoursWorked", align: "center", nearest: true },
		{ key: "Regular Hrs", pair: "totalRegHoursWorked", align: "center", nearest: true },
		{
			key: "Add Regular",
			pair: "additionalRegHoursWorked",
			isEditable: true,
			nearest: true,
		},
		{ key: "Overtime Hrs", pair: "totalOvertimeHoursWorked", align: "center", nearest: true },
		{
			key: "Add Overtime",
			pair: "additionalOvertimeHoursWorked",
			isEditable: true,
			nearest: true,
		},
		{
			key: "Double OT Hrs",
			pair: "totalDblOvertimeHoursWorked",
			align: "center",
			nearest: true,
		},
		{
			key: "Add Double OT",
			pair: "additionalDblOvertimeHoursWorked",
			isEditable: true,
			nearest: true,
		},
		{ key: "Stat. Pay Hrs", pair: "totalStatHours", align: "center", nearest: true },
		{
			key: "Add Stat. Pay",
			pair: "additionalStatHoursWorked",
			isEditable: true,
			nearest: true,
		},
		{
			key: "Stat. Worked Hrs",
			pair: "totalStatDayHoursWorked",
			align: "center",
			nearest: true,
		},
		{
			key: "Add Stat. Wrked",
			pair: "additionalStatDayHoursWorked",
			isEditable: true,
			nearest: true,
		},
		{ key: "Vacation Hrs", pair: "totalVacationHoursWorked", align: "center", nearest: true },
		{
			key: "Add Vacation",
			pair: "additionalVacationHoursWorked",
			isEditable: true,
			nearest: true,
		},
		{
			key: "Sick Pay Hrs",
			pair: "totalSickHoursWorked",
			align: "center",
			nearest: true,
		},
		{
			key: "Add Sick",
			pair: "additionalSickHoursWorked",
			isEditable: true,
			nearest: true,
		},
		{
			key: "",
			pair: <OutlineButton size="xs" name="setup" label="View Timesheets" />,
		},
	];

	const [formData, setFormData] = useState(null);

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
				updatedRec.companyName = company;
				updatedRec.payPeriodPayDate = closestRecord?.payPeriodPayDate;
				await PayrollService.addAdditionalHoursAllocation(updatedRec);
				setFormData(null);
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
		<WorkviewTab
			cellClick={cellClick}
			renderEditableInput={renderEditableInput}
			isEditable
			cols={HOURLY_ALLOCATE_COLS}
			data={hourlyAllocatedHours}
			label="Setup"
			path={timesheetPath}
		/>
	);
};

export default HourlyAllocation;
