import { Avatar, HStack, Spacer, Tbody, Td, Tr, useToast, VStack } from "@chakra-ui/react";
import ActiveBadge from "components/ActiveBadge";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import useCompanyEmployees from "hooks/useCompanyEmployees";
import usePaygroup from "hooks/usePaygroup";
import useSortableData from "hooks/useSortableData";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { getDeptName, getPayNum, isExtraPay, isShadowUser, sortRecordsByDate } from "utils";
import { dayMonthYear, formatDateRange } from "utils/convertDate";
import EmpProfileSearch from "../../employees/EmpProfileSearch";
import { tabScrollCss } from "../../onboard-user/customInfo";
import PreviewReportsModal from "../PreviewReportsModal";

const REPORT_SORT_KEYS = {
	"Pay number": ({ payPeriodNum, isExtraRun }) => isExtraPay(payPeriodNum, isExtraRun),
	"Pay date": "payPeriodPayDate",
	"Pay period": "payPeriodStartDate",
	Status: "name",
};

const Reports = () => {
	const { isMobile } = useBreakpointValue();
	const toast = useToast();
	const company = LocalStorageService.getItem("selectedCompany");
	const [showReport, setShowReport] = useState(undefined);
	const REPORT_COLS = ["Pay number", "Pay date", "Pay period", "Status", "Action"];
	const [payStub, setPayStub] = useState(null);

	const loggedInUser = LocalStorageService.getItem("user");
	const [employee, setEmployee] = useState(null);
	const [userId, setUserId] = useState(null);
	const [defaultDept, setDefaultDept] = useState(null);
	const [empPayStub, setEmpPayStub] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState(null);
	const { sortedItems, sortConfig, requestSort } = useSortableData(empPayStub);

	const { hasMultiPaygroups, selectedPayGroupOption, setSelectedPayGroupOption, payGroups } =
		usePaygroup(company, false);

	const employees = useCompanyEmployees(company, defaultDept, selectedPayGroupOption);

	const isActivePayroll = employee?.payrollStatus?.includes("Active");

	useEffect(() => {
		setFilteredEmployees(employees);
	}, [employees]);

	useEffect(() => {
		if (!isShadowUser(loggedInUser?.role)) {
			setUserId(loggedInUser._id);
			const deptName = getDeptName(loggedInUser);
			setDefaultDept(deptName);
		}
	}, []);

	useEffect(() => {
		const fetchEmpPayStubs = async () => {
			try {
				setEmpPayStub(null);
				const { data } = await PayrollService.getEmpPayReportDetails(company, userId);
				const sortedResult = sortRecordsByDate(data, "payPeriodNum", false, false);
				setEmpPayStub(sortedResult);
			} catch (error) {
				console.error(error);
				setEmpPayStub([]);
				toast({
					title: "Could not load pay stubs",
					description: error?.response?.data?.message || "Please try again.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		};
		if (userId) fetchEmpPayStubs();
	}, [userId]);

	const handleRegister = (payNo, isExtra) => {
		const record = getPayNum(payNo, isExtra, empPayStub);
		setPayStub(record);
		setShowReport(true);
	};

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroupOption(value);
		}
	};

	return (
		<PageLayout
			title="Individual Reports"
			handleChange={handleChange}
			hasMultiPaygroups={hasMultiPaygroups}
			width={"35%"}
			showPayGroup={true}
			selectedValue={selectedPayGroupOption}
			data={payGroups}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
		>
			<HStack mb={5} spacing="1em" justifyContent={"space-between"}>
				<HStack spacing="1em" justifyContent={"space-between"}>
					<Avatar
						borderRadius="10%"
						// onClick={handleToggle}
						name={employee?.fullName}
						src={null}
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
			<TableLayout
				cols={REPORT_COLS}
				sortKeys={REPORT_SORT_KEYS}
				sortConfig={sortConfig}
				onSort={requestSort}
				w={"100%"}
				top={-1}
				textAlign="center"
				height={"calc(100vh - 255px)"}
				css={tabScrollCss}
			>
				<Tbody>
					{!userId ? (
						<EmptyRowRecord
							title="Select an employee"
							description=""
							data={[]}
							colSpan={REPORT_COLS.length}
						/>
					) : (
						(!empPayStub || empPayStub.length === 0) && (
							<EmptyRowRecord description="" data={empPayStub} colSpan={REPORT_COLS.length} />
						)
					)}
					{sortedItems?.map(
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
					isMobile={isMobile}
					size="4xl"
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
