import { HStack, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import useEmployeeAlertsInfo from "hooks/useEmployeeAlertsInfo";
import useEmployees from "hooks/useEmployees";
import useTimesheet from "hooks/useTimesheet";
import { useEffect, useState } from "react";
import { processPayrollPath, timesheetPath } from "routes";

const PayPeriodDetails = ({
	company,
	filter,
	selectedPayPeriod,
	handleClick,
}) => {
	const { employees } = useEmployees(false, company, false, true);
	const [approvalPercent, setApprovalPercent] = useState(0);
	const [violationPercent, setViolationPercent] = useState(100);
	const [reviewPercent, setReviewPercent] = useState(null);
	const [submitPercent, setSubmitPercent] = useState(null);

	const [currentStep, setCurrentStep] = useState(0);
	const [progressPercent, setProgressPercent] = useState(0);

	const timesheets = useTimesheet(company, null, null, filter);

	useEffect(() => {
		if (!timesheets?.length) {
			return;
		}
		const approvedTimesheet = timesheets.filter(
			(_) => _.approveStatus === "Approved",
		).length;
		const rejectedTimesheet = timesheets.filter(
			(_) => _.approveStatus === "Rejected",
		).length;

		const calcApprovedPercent =
			((approvedTimesheet + rejectedTimesheet) / timesheets.length) * 100;

		setApprovalPercent(calcApprovedPercent);
	}, [timesheets]);

	const alertsReviewData = useEmployeeAlertsInfo(
		company,
		selectedPayPeriod,
		true,
		2,
	);
	useEffect(() => {
		if (alertsReviewData?.length) {
			setViolationPercent(0);
		}
	}, [alertsReviewData]);

	useEffect(() => {
		const avgPercent = ((approvalPercent + violationPercent) / 2).toFixed(2);
		setProgressPercent(avgPercent);
		// setCurrentStep(2);
	}, [approvalPercent, violationPercent]);

	const steps = [
		{
			title: "Timesheet Approvals",
			description:
				approvalPercent < 100 ? approvalPercent.toFixed(2) : approvalPercent,
			linkTo: {
				title: "Go to timesheet",
				path: timesheetPath,
			},
		},
		{
			title: "Outstanding Violations",
			description: violationPercent,
			linkTo: {
				title: "Address violation",
				path: processPayrollPath,
			},
		},
		{
			title: "Review Reports",
			description: 0,
			linkTo: {
				title: "Process Payroll",
				path: processPayrollPath,
			},
		},
		{
			title: "Submit",
			description: 0,
			linkTo: {
				title: "Process Payroll",
				path: processPayrollPath,
			},
		},
	];
	return (
		<HStack
			w={"100%"}
			justifyContent={"space-between"}
			color={"var(--nav_color)"}
			px="1em"
			bg={"var(--bg_color_1)"}
			border="3px solid var(--bg_color_1)"
			borderRadius="10px"
		>
			<VStack>
				<TextTitle title={"Total Active Workforce"} />
				<NormalTextTitle
					title={`Task progress of ${employees?.length} employees`}
				/>
			</VStack>
			<TextTitle
				title={`${progressPercent}%`}
				align="end"
				color={"var(--primary_button_bg)"}
			/>
		</HStack>
	);
};

export default PayPeriodDetails;
