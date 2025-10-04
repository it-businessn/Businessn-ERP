import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import { ConfigTabLayout } from "../../../components/ConfigTabLayout";
import RoleForm from "./RoleForm";
import { RolesList } from "./RolesList";

const RolePanel = ({ companyName }) => {
	const [roleList, setRoleList] = useState(null);
	const [editingId, setEditingId] = useState(null);

	const defaultFormData = { name: "", description: "", companyName };
	const [formData, setFormData] = useState(defaultFormData);

	useEffect(() => {
		const fetchAllRoles = async () => {
			try {
				const { data } = await SettingService.getAllRoles(companyName);
				setRoleList(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (companyName) fetchAllRoles();
	}, [companyName]);

	const handleEdit = (company) => {
		setEditingId(company._id);
		setFormData((prevData) => ({
			...prevData,
			name: company?.name,
			description: company?.description,
		}));
	};

	const handleClose = () => {
		setEditingId(null);
		setFormData(defaultFormData);
	};

	return (
		<ConfigTabLayout
			tableData={roleList}
			tableTitle="System Access Level Roles"
			tableContent={<RolesList roleList={roleList} handleEdit={handleEdit} />}
			leftContent={
				<RoleForm
					editingId={editingId}
					handleClose={handleClose}
					formData={formData}
					setFormData={setFormData}
					setRoleList={setRoleList}
				/>
			}
		/>
	);
};

export default RolePanel;
