import { HStack, Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { ROLES } from "constant";
import useEmployees from "hooks/useEmployees";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import { addBusinessDays, getDefaultDate } from "utils/convertDate";

const ExtraPayrunModal = ({
	showExtraPayrun,
	setShowExtraPayrun,
	setRefresh,
	company,
	selectedPayGroup,
	closestRecord,
}) => {
	const loggedInUser = LocalStorageService.getItem("user");
	const deptName = loggedInUser?.role === ROLES.MANAGER ? loggedInUser?.department : null;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const today = getDefaultDate();

	const [payPeriodProcessingDate, setPayPeriodProcessingDate] = useState(today);
	const isProcessingDateTomorrow = addBusinessDays(today, 3);

	const [payPeriodPayDate, setPayPeriodPayDate] = useState(
		getDefaultDate(isProcessingDateTomorrow),
	);

	useEffect(() => {
		const newPayDate = addBusinessDays(payPeriodProcessingDate, 3);
		setPayPeriodPayDate(getDefaultDate(newPayDate));
	}, [payPeriodProcessingDate]);

	const [payPeriodStartDate, setPayPeriodStartDate] = useState(
		getDefaultDate(closestRecord?.payPeriodStartDate),
	);
	const [payPeriodEndDate, setPayPeriodEndDate] = useState(
		getDefaultDate(closestRecord?.payPeriodEndDate),
	);

	const [selectedEmp, setSelectedEmp] = useState([]);
	const { employees } = useEmployees(false, company, false, true, null, deptName);
	const [openMenu, setOpenMenu] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);

	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowExtraPayrun(false);
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
		const payPeriodNum = closestRecord.isProcessed
			? closestRecord.payPeriod
			: closestRecord.payPeriod - 1;
		try {
			selectedPayGroup.yearSchedules[0]?.payPeriods.push({
				payPeriod: payPeriodNum,
				selectedEmp,
				payPeriodPayDate,
				payPeriodProcessingDate,
				payPeriodStartDate,
				payPeriodEndDate,
				isExtraRun: true,
			});
			await SettingService.updateGroup(
				{ yearSchedules: selectedPayGroup.yearSchedules },
				selectedPayGroup._id,
			);
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
			title={"Add extra payrun"}
			size="lg"
			isOpen={showExtraPayrun}
			onClose={handleClose}
		>
			<Stack spacing={3} mt={"-1em"}>
				<MultiSelectFormControl
					label={"Select Employees"}
					tag={"employee(s) selected"}
					showMultiSelect={openMenu}
					data={employees}
					handleCloseMenu={handleCloseMenu}
					selectedOptions={selectedOptions}
					setSelectedOptions={setSelectedOptions}
					handleMenuToggle={handleMenuToggle}
					list={selectedEmp}
					hideAvatar
				/>
				<DateTimeFormControl
					minDate={payPeriodPayDate}
					label={"Select pay date"}
					valueText1={payPeriodPayDate}
					name1="payPeriodPayDate"
					handleChange={(e) => setPayPeriodPayDate(e.target.value)}
					required
				/>
				<DateTimeFormControl
					minDate={today}
					label={"Select processing date"}
					valueText1={payPeriodProcessingDate}
					name1="payPeriodProcessingDate"
					handleChange={(e) => setPayPeriodProcessingDate(e.target.value)}
					required
				/>
				<HStack spacing={4}>
					<DateTimeFormControl
						label={"Pay period start date"}
						valueText1={payPeriodStartDate}
						name1="payPeriodStartDate"
						handleChange={(e) => setPayPeriodStartDate(e.target.value)}
						required
					/>
					<DateTimeFormControl
						label={"Pay period end date"}
						valueText1={payPeriodEndDate}
						name1="payPeriodEndDate"
						handleChange={(e) => setPayPeriodEndDate(e.target.value)}
						required
					/>
				</HStack>
				<ActionButtonGroup
					submitBtnName={"Add Payrun"}
					isDisabled={!selectedEmp.length}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default ExtraPayrunModal;
