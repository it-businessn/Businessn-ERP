import { HStack, Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";

const PayrunModal = ({ showExtraPayrun, setShowExtraPayrun, setRefresh }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [payDate, setPayDate] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowExtraPayrun(false);
	};

	const handleSubmit = async () => {
		// setIsSubmitting(true);
		// try {
		// 	await SettingService.addDepartment({
		// 		name: deptName,
		// 		description: deptDescription,
		// 		companyName,
		// 	});
		setRefresh((prev) => !prev);
		// 	setDeptName("");
		// 	setDeptDescription("");
		handleClose();
		// } catch (error) {
		// 	console.log("An error occurred. Please try again.");
		// } finally {
		// 	setIsSubmitting(false);
		// }
	};
	return (
		<ModalLayout
			title={"Add extra payrun"}
			size="md"
			isOpen={showExtraPayrun}
			onClose={handleClose}
		>
			<Stack spacing={4}>
				<DateTimeFormControl
					label={"Select pay date"}
					valueText1={payDate}
					name1="payDate"
					handleChange={(e) => setPayDate(e.target.value)}
					required
				/>
				<HStack spacing={4}>
					<DateTimeFormControl
						label={"Pay period start date"}
						valueText1={startDate}
						name1="startDate"
						handleChange={(e) => setStartDate(e.target.value)}
						required
					/>
					<DateTimeFormControl
						label={"Pay period end date"}
						valueText1={endDate}
						name1="endDate"
						handleChange={(e) => setEndDate(e.target.value)}
						required
					/>
				</HStack>

				<ActionButtonGroup
					submitBtnName={"Add Payrun"}
					isDisabled={payDate === ""}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default PayrunModal;
