import { Avatar, HStack, Spacer, Tbody, Td, Tr, VStack } from "@chakra-ui/react";
import ActiveBadge from "components/ActiveBadge";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { ROLES } from "constant";
import useCompany from "hooks/useCompany";
import useCompanyEmployees from "hooks/useCompanyEmployees";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { getPayNum, isExtraPay, sortRecordsByDate } from "utils";
import { dayMonthYear, formatDateRange } from "utils/convertDate";
import EmpProfileSearch from "../employees/EmpProfileSearch";
import PreviewReportsModal from "../process-payroll/preview-reports/PreviewReportsModal";

const Reports = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const [showReport, setShowReport] = useState(undefined);
	const REPORT_COLS = ["Pay number", "Pay date", "Pay period", "Status", "Action"];
	const [payStub, setPayStub] = useState(null);

	const loggedInUser = LocalStorageService.getItem("user");
	const deptName = loggedInUser?.role === ROLES.MANAGER ? loggedInUser?.department : null;
	const [employee, setEmployee] = useState(loggedInUser);
	const isActivePayroll = employee?.payrollStatus?.includes("Active");
	const employees = useCompanyEmployees(company, deptName);

	const [filteredEmployees, setFilteredEmployees] = useState(null);

	useEffect(() => {
		setFilteredEmployees(employees);
	}, [employees]);

	const [userId, setUserId] = useState(loggedInUser._id);
	const [empPayStub, setEmpPayStub] = useState(null);

	useEffect(() => {
		const fetchEmpPayStubs = async () => {
			try {
				const { data } = await PayrollService.getEmpPayReportDetails(company, userId);

				const sortedResult = sortRecordsByDate(data, "payPeriodNum", false, false);
				setEmpPayStub(sortedResult);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmpPayStubs();
	}, [userId]);

	const handleRegister = (payNo, isExtra) => {
		const record = getPayNum(payNo, isExtra, empPayStub);
		setPayStub(record);
		setShowReport(true);
	};

	return (
		<PageLayout title="Individual Reports">
			<HStack mb={5} spacing="1em" justifyContent={"space-between"}>
				<HStack spacing="1em" justifyContent={"space-between"}>
					<Avatar
						borderRadius="10%"
						// onClick={handleToggle}
						name={employee?.fullName}
						src=""
						boxSize="15"
					/>
					<VStack spacing={0} align={"start"}>
						<TextTitle size="sm" title={employee?.fullName} />
						<NormalTextTitle size="xs" title={employee?.employeeId} />
						{isActivePayroll && <ActiveBadge title={"Payroll Activated"} />}
					</VStack>
				</HStack>
				<Spacer />
				<EmpProfileSearch
					filteredEmployees={filteredEmployees}
					setFilteredEmployees={setFilteredEmployees}
					setUserId={setUserId}
					setEmployee={setEmployee}
					employees={employees}
				/>
			</HStack>
			<TextTitle title="Reports" />
			<TableLayout cols={REPORT_COLS} w={"100%"} top={-1} textAlign="center" height={"66vh"}>
				<Tbody>
					{(!empPayStub || empPayStub?.length === 0) && (
						<EmptyRowRecord data={empPayStub} colSpan={REPORT_COLS.length} />
					)}
					{empPayStub?.map(
						(
							{
								payPeriod,
								payPeriodStartDate,
								payPeriodEndDate,
								payPeriodPayDate,
								color,
								name,
								bg,
								isViewAction,
								isDisabledStatus,
								isDisabledAction,
								isExtraRun,
								payPeriodNum,
							},
							index,
						) => (
							<Tr key={`${payPeriod}_${index}`}>
								<Td p={1} pl={8}>
									{isExtraPay(payPeriodNum, isExtraRun)}
								</Td>
								<Td p={1}>{dayMonthYear(payPeriodPayDate)}</Td>
								<Td p={1}>{formatDateRange(payPeriodStartDate, payPeriodEndDate)}</Td>
								<Td p={1}>
									<PrimaryButton
										color={color}
										bg={bg}
										name={name}
										size="xs"
										px={0}
										isDisabled={isDisabledStatus}
										hover={{
											bg,
											color,
										}}
										w={"92px"}
									/>
								</Td>
								<Td p={1}>
									<OutlineButton
										label="View Paystub"
										size="xs"
										onClick={() => {
											handleRegister(isExtraPay(payPeriodNum, isExtraRun), isExtraRun);
										}}
									/>
								</Td>
							</Tr>
						),
					)}
				</Tbody>
			</TableLayout>
			{showReport && payStub && (
				<PreviewReportsModal
					size="5xl"
					isReport
					isOpen={showReport}
					onClose={() => setShowReport(false)}
					reportData={payStub}
					isEarningTable
					isIndividual
				/>
			)}
		</PageLayout>
	);
};

export default Reports;
