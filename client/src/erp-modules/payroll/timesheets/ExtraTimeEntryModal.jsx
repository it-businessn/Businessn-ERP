import { HStack, Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import useEmployees from "hooks/useEmployees";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { getDefaultDate, getTimeFormat, setUTCDate } from "utils";
import { getParamKey, PAY_TYPES } from "./data";

const ExtraTimeEntryModal = ({
	showAddEntry,
	setShowAddEntry,
	setRefresh,
	company,
	closestRecord,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const initialFormData = {
		type: "",
		createdOn: new Date(),
		company,
		employeeId: "",
		clockIn: null,
		clockOut: null,
		param_hours: "",
	};
	const [formData, setFormData] = useState(initialFormData);
	const { employees } = useEmployees(false, company);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const { onClose } = useDisclosure();

	useEffect(() => {
		if (formData.type !== "") {
			const { param_hours } = getParamKey(formData.type);
			setFormData((prevData) => ({ ...prevData, param_hours: param_hours }));
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
			console.log("An error occurred. Please try again.");
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
			<Stack spacing={3} mt={"-1em"}>
				<SelectFormControl
					valueParam="_id"
					name="fullName"
					label={"Select employee"}
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
				<SelectFormControl
					name="type"
					label={"Type of Pay"}
					valueText={formData.type}
					handleChange={handleChange}
					options={PAY_TYPES}
					placeholder="Select pay type"
				/>
				<DateTimeFormControl
					label={"Select worked date"}
					valueText={getDefaultDate(formData.createdOn)}
					name1="createdOn"
					handleChange={handleChange}
					required
				/>
				<HStack>
					<DateTimeFormControl
						timeLabel="Start Time"
						valueText2={formData.clockIn ? getTimeFormat(formData.clockIn) : ""}
						name2="clockIn"
						handleChange={(e) => {
							setFormData((prevData) => ({
								...prevData,
								clockIn: setUTCDate(formData.createdOn, e.target.value),
							}));
						}}
						required
					/>
					<DateTimeFormControl
						timeLabel="End Time"
						valueText2={
							formData.clockOut ? getTimeFormat(formData.clockOut) : ""
						}
						name2="clockOut"
						required
						handleChange={(e) => {
							setFormData((prevData) => ({
								...prevData,
								clockOut: setUTCDate(formData.createdOn, e.target.value),
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
