import { Input } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import { useEffect, useState } from "react";
import { ROUTE_PATH } from "routes";
import PayrollService from "services/PayrollService";
import WorkviewTab from "./WorkviewTab";

const HourlyAllocation = ({ company, closestRecord, groupId }) => {
	const data = useEmployeeHoursWorked(company, closestRecord, groupId);

	const [hourlyAllocatedHours, setHourlyAllocatedHours] = useState(null);
	const HOURLY_ALLOCATE_COLS = [
		{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
		{ key: "Regular Hrs", pair: "totalRegHoursWorked", align: "center" },
		{
			key: "Add Regular",
			pair: "additionalRegHoursWorked",
			isEditable: true,
		},
		{ key: "Overtime Hrs", pair: "totalOvertimeHoursWorked", align: "center" },
		{
			key: "Add Overtime",
			pair: "additionalOvertimeHoursWorked",
			isEditable: true,
		},
		{
			key: "Double Overtime Hrs",
			pair: "totalDblOvertimeHoursWorked",
			align: "center",
		},
		{
			key: "Add Dbl Overtime",
			pair: "additionalDblOvertimeHoursWorked",
			isEditable: true,
		},
		{ key: "Stat. Pay Hrs", pair: "totalStatHours", align: "center" },
		{ key: "Additional", pair: "additionalStatHoursWorked", isEditable: true },
		{
			key: "Stat. Worked Hrs",
			pair: "totalStatDayHoursWorked",
			align: "center",
		},
		{
			key: "Add Stat. Worked",
			pair: "additionalStatDayHoursWorked",
			isEditable: true,
		},
		{ key: "Vacation Hrs", pair: "totalVacationHoursWorked", align: "center" },
		{
			key: "Add Vacation",
			pair: "additionalVacationHoursWorked",
			isEditable: true,
		},
		{
			key: "Sick Pay Hrs",
			pair: "totalSickHoursWorked",
			align: "center",
		},
		{
			key: "Add Sick",
			pair: "additionalSickHoursWorked",
			isEditable: true,
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
			record.empId._id === id ? { ...record, [field]: value } : record,
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
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`}
		/>
	);
};

export default HourlyAllocation;
