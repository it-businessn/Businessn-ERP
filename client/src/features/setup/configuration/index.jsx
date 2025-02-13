import PrimaryButton from "components/ui/button/PrimaryButton";
import { useState } from "react";
import CompaniesPanel from "../company/CompaniesPanel";
import AddNewGroup from "../company/group-tab/AddNewGroup";

const ConfigurationPanel = ({ company }) => {
	const [openAddGroup, setOpenAddGroup] = useState(false);
	return (
		<>
			<PrimaryButton name="Add Paygroup" onOpen={() => setOpenAddGroup(true)} />
			{<CompaniesPanel />}
			{openAddGroup && (
				<AddNewGroup
					isOpen={openAddGroup}
					company={company}
					onClose={() => setOpenAddGroup(false)}
				/>
			)}
		</>
	);
};

export default ConfigurationPanel;
