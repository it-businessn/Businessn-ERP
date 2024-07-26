import { HStack, Stack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import SettingService from "services/SettingService";

const EditGroup = ({
	isOpen,
	onClose,
	selectedGroup,
	startDate,
	endDate,
	processingDate,
	payDate,
}) => {
	const defaultSchedule = {
		startDate,
		endDate,
		processingDate,
		payDate,
	};
	const [formData, setFormData] = useState(defaultSchedule);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		selectedGroup.scheduleSettings = formData;
		setIsSubmitting(true);
		try {
			await SettingService.updateGroup(selectedGroup, selectedGroup._id);
			onClose();
		} catch (error) {
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ModalLayout
			title={`Edit ${selectedGroup.name}`}
			size="lg"
			isOpen={isOpen}
			onClose={onClose}
		>
			<Stack spacing={4}>
				<HStack spacing={4}>
					<DateTimeFormControl
						label={"Pay period start date"}
						valueText1={formData.startDate}
						name1="startDate"
						handleChange={(e) =>
							setFormData((prev) => ({
								...prev,
								startDate: e.target.value,
							}))
						}
						required
					/>
					<DateTimeFormControl
						label={"Pay period end date"}
						valueText1={formData.endDate}
						name1="endDate"
						handleChange={(e) =>
							setFormData((prev) => ({
								...prev,
								endDate: e.target.value,
							}))
						}
						required
					/>
				</HStack>
				<HStack spacing={4}>
					<DateTimeFormControl
						label={"Payroll Processing date"}
						valueText1={formData.processingDate}
						name1="processingDate"
						handleChange={(e) =>
							setFormData((prev) => ({
								...prev,
								processingDate: e.target.value,
							}))
						}
						required
					/>
					<DateTimeFormControl
						label={"Pay date"}
						valueText1={formData.payDate}
						name1="payDate"
						handleChange={(e) =>
							setFormData((prev) => ({
								...prev,
								payDate: e.target.value,
							}))
						}
						required
					/>
				</HStack>
				<ActionButtonGroup
					submitBtnName={"Save"}
					isDisabled={formData.name === ""}
					isLoading={isSubmitting}
					onClose={onClose}
					onOpen={handleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default EditGroup;
