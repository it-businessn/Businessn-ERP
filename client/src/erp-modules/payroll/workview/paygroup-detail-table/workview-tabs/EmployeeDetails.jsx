import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "./WorkviewTab";

const EmployeeDetails = ({ company }) => {
	const data = useEmployeeEmploymentInfo(company);

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
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}`}
		/>
	);
};

export default EmployeeDetails;
