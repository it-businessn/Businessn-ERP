import { Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import useEmployees from "hooks/useEmployees";
import { useState } from "react";
import { getDefaultDate } from "utils";

const ExtraTimeEntryModal = ({
	showAddEntry,
	setShowAddEntry,
	setRefresh,
	company,
	closestRecord,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const today = getDefaultDate(new Date());

	const [payPeriodPayDate, setPayPeriodPayDate] = useState(
		getDefaultDate(closestRecord?.payPeriodPayDate),
	);
	const [payPeriodProcessingDate, setPayPeriodProcessingDate] = useState(
		getDefaultDate(closestRecord?.payPeriodProcessingDate),
	);
	const [payPeriodStartDate, setPayPeriodStartDate] = useState(
		getDefaultDate(closestRecord?.payPeriodStartDate),
	);
	const [payPeriodEndDate, setPayPeriodEndDate] = useState(
		getDefaultDate(closestRecord?.payPeriodEndDate),
	);

	const [selectedEmp, setSelectedEmp] = useState("");
	const { employees } = useEmployees(false, company);
	const [openMenu, setOpenMenu] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);

	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowAddEntry(false);
		reset();
	};

	const reset = () => {
		setSelectedEmp([]);
		setPayPeriodPayDate(today);
		setPayPeriodProcessingDate(today);
		setPayPeriodStartDate(today);
		setPayPeriodEndDate(today);
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenMenu(false);
		setSelectedEmp(selectedOptions);
	};

	const handleMenuToggle = () => {
		setOpenMenu((prev) => !prev);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		// try {
		// 	selectedPayGroup.scheduleSettings.push({
		// 		payPeriod: `${closestRecord.payPeriod}E`,
		// 		selectedEmp,
		// 		payPeriodPayDate,
		// 		payPeriodProcessingDate,
		// 		payPeriodStartDate,
		// 		payPeriodEndDate,
		// 	});
		// 	await SettingService.updateGroup(
		// 		{ scheduleSettings: selectedPayGroup.scheduleSettings },
		// 		selectedPayGroupId,
		// 	);
		// 	setRefresh((prev) => !prev);
		// 	handleClose();
		// } catch (error) {
		// 	console.log("An error occurred. Please try again.");
		// } finally {
		// 	setIsSubmitting(false);
		// }
	};
	const PAY_TYPES = [
		{
			name: "Regular Pay",
			value: "Regular Pay",
		},
		{
			name: "Overtime Pay",
			value: "Overtime Pay",
		},
		{
			name: "Double Overtime Pay",
			value: "Mailing List",
		},
		{
			name: "Statutory Worked Pay",
			value: "Meeting",
		},
		{
			name: "Statutory Pay",
			value: "LinkedIn Contact",
		},
		{
			name: "Sick Pay",
			value: "LinkedIn Message",
		},
	];
	return (
		<ModalLayout
			title={"Add timesheet record"}
			size="lg"
			isOpen={showAddEntry}
			onClose={handleClose}
		>
			<Stack spacing={3} mt={"-1em"}>
				<SelectFormControl
					name="fullName"
					label={"Select employee"}
					valueText={selectedEmp}
					handleChange={() => {}}
					options={employees}
				/>
				<SelectFormControl
					name="type"
					label={"Type of Pay"}
					valueText={""}
					handleChange={() => {}}
					options={PAY_TYPES}
				/>
				<DateTimeFormControl
					label={"Select worked date"}
					valueText1={payPeriodPayDate}
					name1="payPeriodPayDate"
					handleChange={(e) => setPayPeriodPayDate(e.target.value)}
					required
				/>
				<ActionButtonGroup
					submitBtnName={"Add"}
					isDisabled={!selectedEmp.length}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default ExtraTimeEntryModal;
