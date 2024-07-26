import { HStack, Stack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import PayrollService from "services/PayrollService";

const EditPayDetail = ({ isOpen, onClose, editFormData, setRefresh }) => {
	const [formData, setFormData] = useState(editFormData);
	const { fullName } = editFormData.empId;

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await PayrollService.updateEmployeePayInfo(formData, formData._id);
			onClose();
			setRefresh((prev) => !prev);
		} catch (error) {}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: parseFloat(value),
		});
	};

	return (
		<ModalLayout
			title={`Update record for: ${fullName}`}
			size="xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<Stack spacing={2}>
				<HStack spacing={2}>
					<InputFormControl
						type="number"
						label={"Commission $"}
						name="commission"
						valueText={formData.commission}
						handleChange={handleInputChange}
						required
					/>
					<InputFormControl
						type="number"
						label={"Retroactive $"}
						name="retroactive"
						valueText={formData.retroactive}
						handleChange={handleInputChange}
						required
					/>
				</HStack>
				<HStack spacing={2}>
					<InputFormControl
						type="number"
						label={"Reimbursement $"}
						name="reimbursement"
						valueText={formData.reimbursement}
						handleChange={handleInputChange}
						required
					/>
					<InputFormControl
						type="number"
						label={"Vacation Payout $"}
						name="vacationPayout"
						valueText={formData.vacationPayout}
						handleChange={handleInputChange}
						required
					/>
				</HStack>
				<HStack spacing={2}>
					<InputFormControl
						type="number"
						label={"Bonus $"}
						name="bonus"
						valueText={formData.bonus}
						handleChange={handleInputChange}
						required
					/>
					<InputFormControl
						type="number"
						label={"Termination Payout $"}
						name="terminationPayout"
						valueText={formData.terminationPayout}
						handleChange={handleInputChange}
						required
					/>
				</HStack>
				<ActionButtonGroup
					submitBtnName={"Save"}
					onClose={onClose}
					onOpen={handleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default EditPayDetail;
