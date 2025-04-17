import { Box, Stack, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import { getReportName } from "constant";
import React from "react";
import { getAmount } from "utils/convertAmt";
import { formatDateBar } from "utils/convertDate";
import BasicInfo from "../statement/BasicInfo";
import InformationSection from "../statement/InformationSection";
import { ACCRUAL_TYPES } from "./data";

const EmployeeInfo = ({ data, companyNum, isMobile }) => {
	return (
		<Stack position="relative" flex={isMobile ? 1 : 0.3} spacing={0} w={isMobile && "100%"}>
			<BoxCard p={0}>
				<Box w={"100%"} bg={"var(--primary_bg_1)"} p={2}>
					<VStack mt={1} spacing={0}>
						<BasicInfo title1="Report Type:" title2={getReportName(data?.reportType)} />
						<BasicInfo title1={"Net Pay:"} title2={getAmount(data?.currentNetPay)} />
						<BasicInfo title1={"Pay Date:"} title2={formatDateBar(data?.payPeriodPayDate)} />
						<BasicInfo
							title1={"Pay Start Date:"}
							title2={formatDateBar(data?.payPeriodStartDate)}
						/>
						<BasicInfo title1={"Pay End Date:"} title2={formatDateBar(data?.payPeriodEndDate)} />
						<BasicInfo mt={4} whiteSpace="wrap" title1={"Name:"} title2={data?.empId?.fullName} />
						<BasicInfo
							whiteSpace="wrap"
							title1={"Address:"}
							title2={
								data?.empId?.primaryAddress?.streetNumber === ""
									? "NA"
									: data?.empId?.primaryAddress?.streetNumber
							}
						/>
						<BasicInfo
							title1={""}
							whiteSpace="wrap"
							title2={`${data?.empId?.primaryAddress?.city}, ${data?.empId?.primaryAddress?.state} ${data?.empId?.primaryAddress?.postalCode}`}
						/>
						<BasicInfo mt={4} title1={"Employee#:"} title2={data?.empId?.employeeNo} />
						<BasicInfo title1={"Company#:"} title2={companyNum} />
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
};

export default EmployeeInfo;
