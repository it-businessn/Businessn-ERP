import { Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import SettingService from "services/SettingService";

const AddNewShiftLocation = ({
	showAddNewLocation,
	setShowAddNewLocation,
	setRefresh,
	company,
}) => {
	const [locationName, setLocationName] = useState("");
	const [isSubmitting, setSubmitting] = useState(false);
	const { onClose } = useDisclosure();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			await SettingService.addLocation({
				name: locationName,
				companyName: company,
			});
			setRefresh((prev) => !prev);
			setSubmitting(false);
			onClose();
			setShowAddNewLocation(false);
		} catch (error) {
			setSubmitting(false);
			onClose();
			setShowAddNewLocation(false);
		}
	};
	const handleClose = () => {
		onClose();
		setShowAddNewLocation(false);
	};
	return (
		<ModalLayout
			title="Add New Location"
			size="md"
			isOpen={showAddNewLocation}
			onClose={handleClose}
		>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<InputFormControl
						label={"Location Name"}
						name="name"
						valueText={locationName}
						handleChange={(e) => setLocationName(e.target.value)}
						required
					/>
					<ActionButtonGroup
						submitBtnName={"Add"}
						isDisabled={locationName === ""}
						isLoading={isSubmitting}
						onClose={handleClose}
					/>
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default AddNewShiftLocation;
