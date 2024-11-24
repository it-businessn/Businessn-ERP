import { HStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { leaveApprovalPath, payrollEmployeePath, timesheetPath } from "routes";

const PayPeriodDetails = ({ employees, activeUsers, handleClick }) => {
	const items = [
		{
			title: "Total Active Workforce",
			description: employees,
			linkTo: {
				title: "Employees",
				path: payrollEmployeePath,
			},
			isHeader: true,
		},
		{
			title: "Currently Active",
			description: activeUsers,
			linkTo: {
				title: "Timesheets",
				path: timesheetPath,
			},
		},
		{
			title: "Currently On leave",
			description: "NA",
			linkTo: {
				title: "Leave Approvals",
				path: leaveApprovalPath,
			},
		},
		{
			title: "Leave Requests Pending",
			description: "NA",
			linkTo: {
				title: "Leave Approvals",
				path: leaveApprovalPath,
			},
		},
	];

	return (
		<BoxCard>
			{items?.map((item) => (
				<HStack
					key={item.title}
					w={"100%"}
					justifyContent={"space-between"}
					color={"var(--nav_color)"}
					bg={item?.isHeader && "var(--bg_color_1)"}
					border={item?.isHeader && "3px solid var(--bg_color_1)"}
					borderRadius="10px"
					mb={3}
				>
					{item?.isHeader ? (
						<TextTitle whiteSpace="wrap" title={item.title} />
					) : (
						<NormalTextTitle title={item.title} whiteSpace="wrap" />
					)}
					<TextTitle align="center" size={"xl"} title={item.description} />
					<NormalTextTitle
						onClick={() => handleClick(item?.linkTo?.path)}
						color="var(--primary_button_bg)"
						title={item.linkTo.title}
						whiteSpace="wrap"
						align="right"
						textDecoration="underline"
						cursor="pointer"
					/>
				</HStack>
			))}
		</BoxCard>
	);
};

export default PayPeriodDetails;
