import { Avatar, HStack, Spacer, Tbody, Td, Tr, VStack } from "@chakra-ui/react";
import ActiveBadge from "components/ActiveBadge";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import UserService from "services/UserService";
import { sortRecordsByDate } from "utils";
import { dayMonthYear, formatDateRange } from "utils/convertDate";
import EmpProfileSearch from "../employees/EmpProfileSearch";

const Reports = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const { payGroupSchedule } = usePaygroup(company, false);

	const [showReport, setShowReport] = useState(undefined);
	const [selectedPayPeriod, setSelectedPayPeriod] = useState(null);
	const REPORT_COLS = ["Pay number", "Pay date", "Pay period", "Status", "Action"];

	const handleRegister = (payNo, isExtra) => {
		const payNum = isExtra
			? payGroupSchedule?.find(
					({ payPeriod, isExtraRun }) => payPeriod === parseInt(payNo) && isExtraRun === isExtra,
			  )
			: payNo;

		setSelectedPayPeriod(payNum);
		setShowReport(true);
	};

	const loggedInUser = LocalStorageService.getItem("user");
	const [employee, setEmployee] = useState(loggedInUser);
	const isActivePayroll = employee?.payrollStatus?.includes("Active");
	const [employees, setEmployees] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState(null);
	const [userId, setUserId] = useState(loggedInUser._id);
	const [empPayStub, setEmpPayStub] = useState(null);

	useEffect(() => {
		const fetchEmpPayStubs = async () => {
			try {
				const { data } = await PayrollService.getEmpPayReportDetails(company, userId);

				const sortedResult = sortRecordsByDate(data, "payPeriodNum");
				setEmpPayStub(sortedResult);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmpPayStubs();
	}, [userId]);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = await UserService.getAllCompanyUsers(company);
				setEmployees(data);
				setFilteredEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, []);

	return (
		<>
			<PageLayout title="Individual Reports">
				<HStack spacing="1em" mt="1em" justifyContent={"space-between"}>
					<HStack spacing="1em" mt="1em" justifyContent={"space-between"}>
						<Avatar
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
			</PageLayout>
			<PageLayout title="Reports">
				<TableLayout
					cols={REPORT_COLS}
					w={"100%"}
					position="sticky"
					zIndex={1}
					top={-1}
					textAlign="center"
					height={"66vh"}
				>
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
										{payPeriodNum}
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
												// handleRegister(isExtraPay(payPeriod, isExtraRun), isExtraRun);
											}}
										/>
									</Td>
								</Tr>
							),
						)}
					</Tbody>
				</TableLayout>
			</PageLayout>
		</>
	);
};

export default Reports;
