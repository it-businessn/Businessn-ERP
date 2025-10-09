import { useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import SchedulerService from "services/SchedulerService";

const RepeatPromptModal = ({
	handleClose,
	isOpen,
	startOfNextWeek,
	employeeShifts,
	company,
	selectedCrew,
	location,
}) => {
	const [weeks, setWeeks] = useState(1);
	const toast = useToast();

	const handleRepeat = async () => {
		try {
			handleClose();
			const { data } = await SchedulerService.repeatWeeklySchedule({
				employeeShifts,
				startOfNextWeek,
				companyName: company,
				crew: selectedCrew,
				location,
				weeks,
			});
			toast({
				title: "Success",
				description: data.message,
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<ModalLayout
			title={"Repeat Schedule"}
			isCentered={false}
			size="xs"
			isOpen={isOpen}
			onClose={handleClose}
		>
			<InputFormControl
				label="Number of weeks to repeat"
				name="fullName"
				valueText={weeks}
				type="number"
				min={1}
				handleChange={(e) => e.target.value && setWeeks(parseInt(e.target.value))}
			/>
			<ActionButtonGroup
				submitBtnName={"Repeat Schedule"}
				isDisabled={!weeks}
				onClose={handleClose}
				onOpen={handleRepeat}
				closeLabel="Cancel"
			/>
		</ModalLayout>
	);
};
export default RepeatPromptModal;
