import useGroup from "hooks/useGroup";
import { useEffect, useState } from "react";
import { CURRENT_YEAR } from "utils/convertDate";
import { ConfigTabLayout } from "../../../components/ConfigTabLayout";
import PaygroupForm from "./PaygroupForm";
import { PaygroupList } from "./PaygroupList";

const PaygroupPanel = ({ company, modules, managers }) => {
	const paygroup = useGroup(company);
	const [allPaygroup, setAllPaygroup] = useState(null);
	const [editingId, setEditingId] = useState(null);

	const defaultFormData = {
		name: "",
		baseModule: [],
		admin: [],
		company,
		payrollActivated: false,
		payFrequency: "",
		yearSchedules: [],
	};
	const [formData, setFormData] = useState(defaultFormData);
	const [yearsList, setYearsList] = useState([CURRENT_YEAR]);
	const [selectedTeams, setSelectedTeams] = useState([]);
	const [selectedModule, setSelectedModule] = useState([]);

	useEffect(() => {
		setAllPaygroup(paygroup);
	}, [paygroup]);

	const handleEdit = (data) => {
		setFormData((prevData) => ({
			...prevData,
			payrollActivated: data?.payrollActivated,
			baseModule: data?.modules,
			name: data?.name,
			admin: data?.admin,
			payFrequency: data?.scheduleFrequency,
			yearSchedules: data?.yearSchedules,
		}));
		setSelectedModule(data?.modules);
		setSelectedTeams(data?.admin);
		setEditingId(data._id);
		setYearsList(data?.yearSchedules.map(({ year }) => year));
	};

	const handleClose = () => {
		setEditingId(null);
		setFormData(defaultFormData);
	};

	return (
		<>
			{/* {showConfirmationPopUp && (
				<DeletePopUp
					headerTitle="Please confirm"
					textTitle="Are you sure you want to delete the paygroup?"
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)} */}
			<ConfigTabLayout
				tableData={allPaygroup}
				tableTitle="All Paygroups"
				tableContent={<PaygroupList allPaygroup={allPaygroup} handleEdit={handleEdit} />}
				leftContent={
					<PaygroupForm
						editingId={editingId}
						setFormData={setFormData}
						modules={modules}
						managers={managers}
						onClose={handleClose}
						formData={formData}
						selectedModule={selectedModule}
						setSelectedModule={setSelectedModule}
						selectedTeams={selectedTeams}
						setSelectedTeams={setSelectedTeams}
						setAllPaygroup={setAllPaygroup}
						yearsList={yearsList}
						setYearsList={setYearsList}
					/>
				}
			/>
		</>
	);
};

export default PaygroupPanel;
