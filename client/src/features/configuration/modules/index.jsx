import { useToast } from "@chakra-ui/react";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import { ConfigTabLayout } from "../../../components/ConfigTabLayout";
import ModuleForm from "./ModuleForm";
import { ModulesList } from "./ModulesList";

const ModulePanel = ({ companyName, setOptionDataRefresh, modules }) => {
	const toast = useToast();
	const [moduleList, setModuleList] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [deletingId, setDeletingId] = useState(null);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const defaultFormData = { name: "", description: "", companyName };
	const [formData, setFormData] = useState(defaultFormData);

	useEffect(() => {
		setModuleList(modules);
	}, [modules]);

	const confirmDelete = async (id) => {
		setShowConfirmationPopUp(true);
		setDeletingId(id);
	};

	const handleEdit = (company) => {
		setEditingId(company._id);
		setFormData((prevData) => ({
			...prevData,
			name: company?.name,
			description: company?.description,
		}));
	};

	const handleClose = () => {
		setShowConfirmationPopUp(false);
		setDeletingId(null);
		setEditingId(null);
		setFormData(defaultFormData);
	};

	const handleDelete = async () => {
		try {
			await SettingService.deleteModule({}, deletingId);
			setModuleList(moduleList.filter((module) => module._id !== deletingId));
			toast({
				title: "Success",
				description: "Module deleted successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			setOptionDataRefresh((prev) => !prev);
			handleClose();
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete Module",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<>
			<ConfigTabLayout
				tableData={moduleList}
				tableTitle="All Modules"
				tableContent={
					<ModulesList modules={moduleList} handleEdit={handleEdit} handleDelete={confirmDelete} />
				}
				leftContent={
					<ModuleForm
						editingId={editingId}
						handleClose={handleClose}
						formData={formData}
						setFormData={setFormData}
						setModuleList={setModuleList}
						resetForm={handleClose}
						setOptionDataRefresh={setOptionDataRefresh}
					/>
				}
			/>
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle="Please confirm"
					textTitle="Are you sure you want to delete the module?"
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</>
	);
};

export default ModulePanel;
