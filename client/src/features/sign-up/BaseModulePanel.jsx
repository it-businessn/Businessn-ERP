import { Stack, useDisclosure, useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import SettingService from "services/SettingService";

const BaseModulePanel = ({
	showAddModules,
	setShowAddModules,
	setOptionDataRefresh,
	companyName,
}) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [moduleName, setModuleName] = useState("");
	const [moduleDesc, setModuleDesc] = useState("");

	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowAddModules(false);
	};

	const handleModuleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addBaseModule({
				name: moduleName,
				description: moduleDesc,
				companyName,
			});
			toast({
				title: "Module added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setOptionDataRefresh((prev) => !prev);
			setModuleName("");
			setModuleDesc("");
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<ModalLayout
			title={"Add new base module"}
			size="md"
			isOpen={showAddModules}
			onClose={handleClose}
		>
			<Stack spacing={4}>
				<InputFormControl
					label={"Name"}
					name="moduleName"
					valueText={moduleName}
					handleChange={(e) => setModuleName(e.target.value)}
					required
					placeholder="Enter Module Name"
				/>
				<InputFormControl
					label={"Description"}
					name="moduleDesc"
					valueText={moduleDesc}
					handleChange={(e) => setModuleDesc(e.target.value)}
					required
					placeholder="Enter Module Description"
				/>
				<ActionButtonGroup
					submitBtnName={"Add Module"}
					isDisabled={moduleName === "" || moduleDesc === ""}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleModuleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default BaseModulePanel;
