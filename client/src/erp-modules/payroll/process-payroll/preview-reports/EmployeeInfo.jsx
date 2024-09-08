import { Box, Stack, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import React from "react";
import { formatDateBar, getAmount } from "utils";
import BasicInfo from "../statement/BasicInfo";
import InformationSection from "../statement/InformationSection";
import { ACCRUAL_TYPES } from "./data";

const EmployeeInfo = ({ data }) => (
	<Stack position="relative" flex={0.1} spacing={0}>
		<BoxCard p={0}>
			<Box w={"100%"} bg={"var(--primary_bg_1)"} p={2}>
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
						title1={"Pay Start Date:"}
						title2={formatDateBar(data.payPeriodStartDate)}
					/>
					<BasicInfo
						title1={"Pay End Date:"}
						title2={formatDateBar(data.payPeriodEndDate)}
					/>
					<BasicInfo mt={4} title1={"Name:"} title2={data.empId.fullName} />
					<BasicInfo title1={"Address:"} title2={"18685 60 Ave "} />
					<BasicInfo title1={""} title2={"Surrey, BC V3S 8K8"} />
					<BasicInfo
						mt={4}
						title1={"Employee#:"}
						title2={data.empId.employeeId}
					/>
					<BasicInfo title1={"Company#:"} title2={"NA"} />
				</VStack>
			</Box>
			<Box w={"100%"} bg={"var(--main_color)"} p={1}>
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
