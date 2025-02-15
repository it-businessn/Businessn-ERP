import { Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import useEmployees from "hooks/useEmployees";
import { useState } from "react";
import SettingService from "services/SettingService";

const AddEmployeeModal = ({
	showAddEmp,
	setShowAddEmp,
	setRefresh,
	company,
	selectedPayGroupId,
	selectedPayGroup,
	selectedEmployee,
	selectedEmployeeIndex,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [selectedEmp, setSelectedEmp] = useState(selectedEmployee);
	const { employees } = useEmployees(false, company, false, true);
	const [openMenu, setOpenMenu] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState(selectedEmp ?? []);

	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowAddEmp(false);
		reset();
	};

	const reset = () => {
		setSelectedEmp([]);
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

		try {
			selectedPayGroup.yearSchedules[0].payPeriods[selectedEmployeeIndex].selectedEmp = selectedEmp;
			await SettingService.updateGroup(
				{ yearSchedules: selectedPayGroup.yearSchedules },
				selectedPayGroupId,
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
			title={"Employees(s) for Extra Payrun-"}
			size="lg"
			isOpen={showAddEmp}
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

				<ActionButtonGroup
					submitBtnName={"Add"}
					isDisabled={!selectedEmp?.length}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default AddEmployeeModal;
