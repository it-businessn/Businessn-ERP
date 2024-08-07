import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeePayInfo from "hooks/useEmployeePayInfo";
import { useState } from "react";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "./WorkviewTab";

const AmountAllocation = ({ company, closestRecord }) => {
	const [refresh, setRefresh] = useState(false);
	const data = useEmployeePayInfo(company, refresh, null, closestRecord);

	return (
		<WorkviewTab
			isEditable
			setRefresh={setRefresh}
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				{ key: "Commission $", pair: "commission" },
				{ key: "Retroactive $", pair: "retroactive" },
				{ key: "Reimbursement $", pair: "reimbursement" },
				{ key: "Vacation Payout $", pair: "vacationPayout" },
				{ key: "Bonus $", pair: "bonus" },
				{ key: "Termination Payout $", pair: "terminationPayout" },
				{ key: "", pair: <OutlineButton label="View Balances" size="sm" /> },
			]}
			data={data}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}`}
		/>
	);
};

export default AmountAllocation;
