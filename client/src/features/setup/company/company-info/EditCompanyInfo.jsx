import { Stack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import SettingService from "services/SettingService";

const EditCompanyInfo = ({ isOpen, companyInfo, onClose }) => {
	const [CRABusinessNo, setCRABusinessNo] = useState(companyInfo?.cra_business_number || "");
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await SettingService.updateCompany({ CRABusinessNo }, companyInfo._id);
			onClose();
		} catch (error) {
			console.log("An error occurred while updating company info");
		}
	};
	return (
		<ModalLayout title={"Edit Company Details"} size="sm" isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<InputFormControl
						label={"CRA business number"}
						name="name"
						valueText={CRABusinessNo}
						handleChange={(e) => {
							setCRABusinessNo(e.target.value);
						}}
					/>
					<ActionButtonGroup submitBtnName={"Save"} onClose={onClose} />
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default EditCompanyInfo;
