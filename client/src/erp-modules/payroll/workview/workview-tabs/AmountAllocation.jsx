import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeePayInfo from "hooks/useEmployeePayInfo";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "../WorkviewTab";

const AmountAllocation = ({ company }) => {
	const data = useEmployeePayInfo(company);

	return (
		<WorkviewTab
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				{ key: "Commission $", pair: "commission" },
				{ key: "Retroactive $", pair: "retro" },
				{ key: "Reimbursement $", pair: "reimburse" },
				{ key: "Vacation Payout $", pair: "vacPay" },
				{ key: "Bonus $", pair: "bonus" },
				{ key: "Termination Payout $", pair: "terminationPayout" },
				{ key: "", pair: <OutlineButton label="View Balances" /> },
			]}
			data={data}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}`}
		/>
	);
};

export default AmountAllocation;
