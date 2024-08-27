import { Box, Stack, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import React from "react";
import { formatDateBar, getAmount, isExtraPay } from "utils";
import BasicInfo from "./BasicInfo";
import { ACCRUAL_TYPES } from "./data";
import InformationSection from "./InformationSection";

const EmployeeInfo = ({ data }) => (
	<Stack position="relative" flex={0.1} spacing={0}>
		<BoxCard bg={"var(--main_color)"} p={1}>
			<Box w={"100%"}>
				<TextTitle align={"center"} title={data.empId.fullName} />
				<VStack mt={1} spacing={0}>
					<BasicInfo
						title1={"Net Pay:"}
						title2={getAmount(data.currentNetPay)}
					/>
					<BasicInfo
						title1={"Pay Date:"}
						title2={formatDateBar(data.payPeriodPayDate)}
					/>
					<BasicInfo
						mt={4}
						title1={"Employee#:"}
						title2={data.empId.employeeId}
					/>
					<BasicInfo title1={"Company#:"} title2={"NA"} />{" "}
					<BasicInfo
						mt={4}
						title1={"Pay Period #:"}
						border={"1px solid black"}
						title2={isExtraPay(data.payPeriodNum, data.isExtraRun)}
					/>
					<BasicInfo
						title1={`${formatDateBar(
							data.payPeriodStartDate,
						)} - ${formatDateBar(data.payPeriodEndDate)}`}
						border={"1px solid black"}
						weight="normal"
					/>
				</VStack>
			</Box>
			<Box w={"100%"} mt={4}>
				<TextTitle align={"center"} title={"Information"} />
				<VStack spacing={0}>
					{ACCRUAL_TYPES.map(({ type, items }) => (
						<React.Fragment key={type}>
							<InformationSection type={type} items={items} data={data} />
						</React.Fragment>
					))}
				</VStack>
			</Box>
		</BoxCard>
	</Stack>
);

export default EmployeeInfo;
