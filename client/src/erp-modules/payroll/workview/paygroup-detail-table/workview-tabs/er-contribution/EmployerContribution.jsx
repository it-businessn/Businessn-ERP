import useEmployeeERContribution from "hooks/useEmployeeERContribution";
import { useEffect, useState } from "react";
import WorkviewTab from "../WorkviewTab";
import {
	MANUAL_ER_COLS,
	PAYOUT_ER_COLS,
	REGULAR_ER_COLS,
	SUPERFICIAL_ER_COLS,
} from "./payrunERContrCols";

const EmployerContribution = ({ company, closestRecord, groupId, payrunOption }) => {
	const data = useEmployeeERContribution(company, closestRecord, groupId, payrunOption);
	const ER_CONTRIBUTION_COL_DATA = {
		1: REGULAR_ER_COLS,
		2: PAYOUT_ER_COLS,
		3: MANUAL_ER_COLS,
		4: SUPERFICIAL_ER_COLS,
	};

	const [payrunAmtData, setPayrunAmtData] = useState(null);
	const [contributionData, setContributionData] = useState(null);
	const [formData, setFormData] = useState(null);

	useEffect(() => {
		setPayrunAmtData(ER_CONTRIBUTION_COL_DATA[payrunOption]);
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

export default EmployerContribution;
