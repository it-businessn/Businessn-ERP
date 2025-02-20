import useEmployeeEEContribution from "hooks/useEmployeeEEContribution";
import { useEffect, useState } from "react";
import WorkviewTab from "../WorkviewTab";
import {
	MANUAL_EE_COLS,
	PAYOUT_EE_COLS,
	REGULAR_EE_COLS,
	SUPERFICIAL_EE_COLS,
} from "./payrunEEContrCols";

const EmployeeContribution = ({ company, closestRecord, groupId, payrunOption }) => {
	const data = useEmployeeEEContribution(company, closestRecord, groupId, payrunOption);
	const EE_CONTRIBUTION_COL_DATA = {
		1: REGULAR_EE_COLS,
		2: PAYOUT_EE_COLS,
		3: MANUAL_EE_COLS,
		4: SUPERFICIAL_EE_COLS,
	};
	const [payrunAmtData, setPayrunAmtData] = useState(null);
	const [contributionData, setContributionData] = useState(null);
	const [formData, setFormData] = useState(null);

	useEffect(() => {
		setPayrunAmtData(EE_CONTRIBUTION_COL_DATA[payrunOption]);
	}, [payrunOption]);

	useEffect(() => {
		if (data) {
			setContributionData(data);
		}
	}, [data]);

	return (
		payrunAmtData && (
			<WorkviewTab overflowX="hidden" cols={payrunAmtData} data={contributionData} label="Setup" />
		)
	);
};

export default EmployeeContribution;
