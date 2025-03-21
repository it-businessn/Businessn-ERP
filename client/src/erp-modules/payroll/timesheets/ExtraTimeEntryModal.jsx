import { HStack, Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import moment from "moment";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import UserService from "services/UserService";
import { getParamKey, PAY_TYPES } from "./data";

const ExtraTimeEntryModal = ({
	showAddEntry,
	setShowAddEntry,
	setRefresh,
	company,
	userId,
	source,
	deptName,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const initialFormData = {
		type: "",
		clockIn: moment(),
		company,
		employeeId: userId ? userId : "",
		param_hours: "",
		source,
		startTime: "05:00",
		endTime: "13:00",
	};
	const [formData, setFormData] = useState(initialFormData);
	const [employees, setEmployees] = useState(null);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = await UserService.getPayrollActiveCompanyUsers(company, deptName);
				data.map((emp) => {
					emp.fullName = emp?.empId?.fullName;
					emp._id = emp?.empId?._id;
					return emp;
				});
				setEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const { onClose } = useDisclosure();

	useEffect(() => {
		if (formData.type !== "") {
			const { param_hours } = getParamKey(formData.type);
			setFormData((prevData) => ({ ...prevData, param_hours }));
		}
	}, [formData.type]);

	const handleClose = () => {
		onClose();
		reset();
	};

	const reset = () => {
		setShowAddEntry(false);
		setFormData(initialFormData);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await TimesheetService.addTimesheet(formData);
			setRefresh((prev) => !prev);
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<ModalLayout
			title={"Add timesheet record"}
			size="lg"
			isOpen={showAddEntry}
			onClose={handleClose}
		>
			<Stack spacing={3}>
				{!userId && (
					<SelectFormControl
						valueParam="_id"
						name="fullName"
						label="Select employee"
						valueText={formData.employeeId}
						handleChange={(e) =>
							setFormData((prevData) => ({
								...prevData,
								employeeId: e.target.value,
							}))
						}
						options={employees}
						placeholder="Select employee"
					/>
				)}
				<SelectFormControl
					name="type"
					label={"Type of Pay"}
					valueText={formData.type}
					handleChange={handleChange}
					options={PAY_TYPES}
					isPayType
					placeholder="Select pay type"
				/>
				<DateTimeFormControl
					label={"Select worked date"}
					valueText1={formData.clockIn}
					name1="clockIn"
					handleChange={handleChange}
					required
				/>
				<HStack>
					<DateTimeFormControl
						timeLabel="Start Time"
						valueText2={formData.startTime}
						name2="startTime"
						handleChange={(e) => {
							setFormData((prevData) => ({
								...prevData,
								startTime: e.target.value,
							}));
						}}
						required
					/>
					<DateTimeFormControl
						timeLabel="End Time"
						valueText2={formData.endTime}
						name2="endTime"
						required
						handleChange={(e) => {
							setFormData((prevData) => ({
								...prevData,
								endTime: e.target.value,
							}));
						}}
					/>
				</HStack>
				<ActionButtonGroup
					submitBtnName={"Add"}
					isDisabled={formData.fullName === ""}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default ExtraTimeEntryModal;
