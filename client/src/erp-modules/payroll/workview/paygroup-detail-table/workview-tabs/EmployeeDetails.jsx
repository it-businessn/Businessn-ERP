import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import WorkviewTab from "./WorkviewTab";

const EmployeeDetails = ({ company, closestRecord, path }) => {
	const empData = useEmployeeEmploymentInfo(company, null, closestRecord);

	const filteredEmp = [];
	const isExtraRun = closestRecord?.isExtraRun;

	if (isExtraRun && empData) {
		const selectedEmp = closestRecord.selectedEmp;
		selectedEmp.forEach((emp) => {
			const empExists = empData?.find((_) => _.empId.fullName === emp);
			if (empExists) {
				filteredEmp.push(empExists);
			}
		});
	}
	const data = isExtraRun ? filteredEmp : empData;

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
			data={data}
			label="Setup"
			path={path}
			stepNum={0}
		/>
	);
};

export default EmployeeDetails;
