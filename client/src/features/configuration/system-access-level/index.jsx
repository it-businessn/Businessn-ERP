import useRoles from "hooks/useRoles";
import { useEffect, useState } from "react";
import { ConfigTabLayout } from "../../../components/ConfigTabLayout";
import RoleForm from "./RoleForm";
import { RolesList } from "./RolesList";

const RolePanel = ({ companyName }) => {
	const roles = useRoles(companyName);

	const [roleList, setRoleList] = useState(null);
	const [editingId, setEditingId] = useState(null);

	const defaultFormData = { name: "", description: "", companyName };
	const [formData, setFormData] = useState(defaultFormData);

	useEffect(() => {
		setRoleList(roles);
	}, [roles]);

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
