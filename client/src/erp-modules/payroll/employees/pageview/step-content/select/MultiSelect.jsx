import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import { useEffect, useState } from "react";

const MultiSelectRecord = ({ param, formData, setFormData, handleConfirm }) => {
	const [openMenu, setOpenMenu] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);

	const handleCloseMenu = (selectedOptions) => {
		setOpenMenu(false);
		setFormData((prevTask) => ({
			...prevTask,
			[param.param_key]: selectedOptions,
		}));
		handleConfirm();
	};

	const handleMenuToggle = () => {
		setOpenMenu((prev) => !prev);
	};

	useEffect(() => {
		if (formData[param.param_key].length) {
			setSelectedOptions(formData[param.param_key]);
		}
	}, [formData[param.param_key]]);

	const showDepartment = formData.employmentRole !== "Employee";

	return (
		showDepartment && (
			<MultiSelectFormControl
				label={"Select Department"}
				tag={"department(s) selected"}
				showMultiSelect={openMenu}
				data={param.options}
				handleCloseMenu={handleCloseMenu}
				selectedOptions={selectedOptions}
				setSelectedOptions={setSelectedOptions}
				handleMenuToggle={handleMenuToggle}
				list={formData[param.param_key]}
				hideAvatar
			/>
		)
	);
};

export default MultiSelectRecord;
