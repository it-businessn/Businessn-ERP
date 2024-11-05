import { HStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { leaveApprovalPath, payrollEmployeePath, timesheetPath } from "routes";

const PayPeriodDetails = ({ employees, activeUsers, handleClick }) => {
	const items = [
		{
			title: "Total Active Workforce",
			description: employees?.length,
			linkTo: {
				title: "Go to Employees",
				path: payrollEmployeePath,
			},
			isHeader: true,
		},
		{
			title: "Currently Active",
			description: activeUsers?.length,
			linkTo: {
				title: "Go to Timesheets",
				path: timesheetPath,
			},
		},
		{
			title: "Currently On leave",
			description: "NA",
			linkTo: {
				title: "Go to Leave Approvals",
				path: leaveApprovalPath,
			},
		},
		{
			title: "Leave Requests Pending",
			description: "NA",
			linkTo: {
				title: "Go to Leave Approvals",
				path: leaveApprovalPath,
			},
		},
	];

	return items?.map((item) => (
		<HStack
			key={item.title}
			w={"100%"}
			justifyContent={"space-between"}
			color={"var(--nav_color)"}
			px="2px"
			bg={item?.isHeader && "var(--bg_color_1)"}
			border={item?.isHeader && "3px solid var(--bg_color_1)"}
			borderRadius="10px"
			mb={3}
		>
			{item?.isHeader ? (
				<TextTitle title={item.title} />
			) : (
				<NormalTextTitle title={item.title} />
			)}
			<TextTitle align={"center"} size={"2xl"} title={item.description} />
			<NormalTextTitle
				onClick={() => handleClick(item?.linkTo?.path)}
				color="var(--primary_button_bg)"
				title={item.linkTo.title}
				size="sm"
				align="right"
				textDecoration="underline"
				cursor="pointer"
			/>
		</HStack>
	));
};

export default PayPeriodDetails;
