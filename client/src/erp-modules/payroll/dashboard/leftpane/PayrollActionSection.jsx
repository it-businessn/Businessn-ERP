import { HStack, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import { useEffect, useState } from "react";
import { processPayrollPath, timesheetPath } from "routes";

const PayrollActionSection = ({ company, filter, handleClick, activeUsers, totalAlerts }) => {
	const [approvalPercent, setApprovalPercent] = useState(0);
	const [violationPercent, setViolationPercent] = useState(100);
	const [reviewPercent, setReviewPercent] = useState(null);
	const [submitPercent, setSubmitPercent] = useState(null);

	const [currentStep, setCurrentStep] = useState(0);
	const [progressPercent, setProgressPercent] = useState(0);

	const [timesheets, setTimesheets] = useState(null);

	useEffect(() => {
		if (!timesheets?.length) {
			return;
		}
		const approvedTimesheet = timesheets.filter(
			({ approveStatus }) => approveStatus === "Approved",
		).length;
		const rejectedTimesheet = timesheets.filter(
			({ approveStatus }) => approveStatus === "Rejected",
		).length;

		const calcApprovedPercent = ((approvedTimesheet + rejectedTimesheet) / timesheets.length) * 100;

		setApprovalPercent(calcApprovedPercent);
	}, [timesheets]);

	useEffect(() => {
		if (totalAlerts) {
			setViolationPercent(0);
		}
	}, [totalAlerts]);

	useEffect(() => {
		const avgPercent = ((approvalPercent + violationPercent) / 2).toFixed(2);
		setProgressPercent(avgPercent);
		// setCurrentStep(2);
	}, [approvalPercent, violationPercent]);

	const steps = [
		{
			title: "Timesheet Approvals",
			description: approvalPercent < 100 ? approvalPercent.toFixed(2) : approvalPercent,
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
				path: `${processPayrollPath}/2`,
			},
		},
		{
			title: "Review Reports",
			description: 0,
			linkTo: {
				title: "Process Payroll",
				path: `${processPayrollPath}/3`,
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
		<VStack spacing={3} alignItems={"start"}>
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
					<TextTitle size={"sm"} title={"Overview of payroll process"} />
					<NormalTextTitle size={"sm"} title={`Task progress of ${activeUsers} employees`} />
				</VStack>
				<TextTitle title={`${progressPercent}%`} align="end" color={"var(--primary_button_bg)"} />
			</HStack>
			<VerticalStepper
				steps={steps}
				currentStep={currentStep}
				handleLinkClick={handleClick}
				indicatorStyle={{ fontSize: "14px" }}
				height="130px"
				top="50%"
			/>
		</VStack>
	);
};

export default PayrollActionSection;
