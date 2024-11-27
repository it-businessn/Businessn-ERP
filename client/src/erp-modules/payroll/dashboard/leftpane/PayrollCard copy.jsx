import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { workViewPath } from "routes";
import { daysAgo, getPayrollStatus, isExtraPay } from "utils";
import PayPeriodCard from "./PayPeriodCard";
import PayPeriodDetailCard from "./PayPeriodDetailCard";
import { longFormat } from "utils/convertDate";

const PayrollCard = ({ prevSchedule, closestRecord, runType, nextSchedule, company }) => {
	const [status, setStatus] = useState({
		color: "",
		bg: "",
		name: "",
		isDisabledStatus: "",
	});
	const [refresh, setRefresh] = useState(false);
	useEffect(() => {
		if (closestRecord) {
			const { color, bg, name, isDisabledStatus } = getPayrollStatus(closestRecord);
			setStatus({ color, bg, name, isDisabledStatus });
			setRefresh((prev) => !prev);
		}
	}, [closestRecord]);

	const navigate = useNavigate();

	const [showReport, setShowReport] = useState(undefined);

	// const registerData = useEmployeePayReport(
	// 	company,
	// 	prevSchedule,
	// 	showReport,
	// 	refresh,
	// );

	return (
		<>
			<HStack gap={4} justifyContent={"space-around"}>
				{prevSchedule && (
					<PayPeriodCard
						isPeriod
						schedule={prevSchedule}
						title1={`Pay Period ${isExtraPay(prevSchedule?.payPeriod, prevSchedule?.isExtraRun)}`}
						title2={`${daysAgo(prevSchedule?.payPeriodProcessingDate)} days ago`}
					/>
				)}

				<PayPeriodCard
					isPeriod
					schedule={closestRecord}
					title1={`Pay Period ${isExtraPay(closestRecord?.payPeriod, closestRecord?.isExtraRun)}`}
					title3={`${daysAgo(closestRecord?.payPeriodProcessingDate)}`}
				/>
				<PayPeriodCard
					isPeriod
					schedule={nextSchedule}
					title1={`Pay Period ${isExtraPay(nextSchedule?.payPeriod, nextSchedule?.isExtraRun)}`}
					title2={`In ${daysAgo(nextSchedule?.payPeriodProcessingDate)} days `}
				/>
			</HStack>
			<PayPeriodDetailCard
				header={"Pay Period"}
				text1={`${longFormat(closestRecord?.payPeriodStartDate)} - `}
				text2={longFormat(closestRecord?.payPeriodEndDate)}
				actionText="Manage Payroll"
				handleClick={() => navigate(workViewPath)}
			/>
			{closestRecord && (
				<PayPeriodDetailCard
					header={"Processing Date"}
					text1={longFormat(closestRecord?.payPeriodProcessingDate)}
					actionText={status?.name}
					bg={status?.bg}
					color={status?.color}
					handleClick={() => navigate(workViewPath)}
				/>
			)}

			<PayPeriodDetailCard
				header={"Pay Date"}
				text1={longFormat(closestRecord?.payPeriodPayDate)}
				isOutlineButton
				handleClick={() => setShowReport(true)}
			/>

			{/* {showReport && (
				<PreviewReportsModal
					isReport
					isOpen={showReport}
					onClose={() => setShowReport(false)}
					isEarningTable
					reportData={registerData}
				/> */}
			{/* )} */}
		</>
	);
};

export default PayrollCard;
