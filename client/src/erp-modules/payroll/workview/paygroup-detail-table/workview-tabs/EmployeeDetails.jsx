import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import WorkviewTab from "./WorkviewTab";

const EmployeeDetails = ({ company, closestRecord, path, groupId }) => {
	const empData = useEmployeeEmploymentInfo(
		company,
		null,
		closestRecord,
		groupId,
	);

	return (
		<WorkviewTab
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				{ key: "Employee Number", pair: "obj", pair_key: "employeeId" },
				{ key: "Payrate", pair: "regPay" },
				{ key: "Employee Department", pair: "companyDepartment" },
				{ key: "Employee Cost Center", pair: "employmentCostCenter" },
				{ key: "", pair: <OutlineButton label="View Setup" /> },
			]}
			data={empData}
			label="Setup"
			path={path}
			stepNum={0}
		/>
	);
};

export default EmployeeDetails;
