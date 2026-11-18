import {
	Box,
	HStack,
	Icon,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import TextTitle from "components/ui/text/TextTitle";
import useEmployeePayReport from "hooks/useEmployeePayReport";
import useSortableData from "hooks/useSortableData";
import { useState } from "react";
import { MdCheckCircle, MdSettingsSuggest } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { convertDecimal, getSignedAmount } from "utils/convertAmt";
import { tabScrollCss } from "../onboard-user/customInfo";
import EmpPayStatement from "../reports/EmpPayStatement";
import { getClosestRecord } from "../workview/data";

const InputsReview = ({
	handleClick,
	isInputsReviewOpen,
	currentStep,
	payGroupSchedule,
	closestRecord,
	isPayPeriodInactive,
}) => {
	const { payNo } = useParams();
	const isExtra = payNo?.includes("E");
	const company = LocalStorageService.getItem("selectedCompany");

	const selectedPayPeriod = getClosestRecord(payNo, isExtra, payGroupSchedule, closestRecord);

	const inputsReviewData = useEmployeePayReport(
		company,
		selectedPayPeriod,
		isInputsReviewOpen && currentStep === 1,
	);
	const { sortedItems, sortConfig, requestSort } = useSortableData(inputsReviewData);

	const COLS = [
		{ title: "Employee name", value: "fullName" },
		{ title: "Net Income", value: "currentNetPay", round: true },
		{ title: "Gross Income", value: "currentGrossPay", round: true },
		{ title: "Total Hours", value: "totalHoursWorked", nearest: true },
		{ title: "Total Addl. Amount", value: "totalAmountAllocated", round: true },
	];

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [record, setRecord] = useState(null);
	const openDrawer = (payslip) => {
		setRecord(payslip);
		onOpen();
	};

	const [isConfirming, setIsConfirming] = useState(false);

	const handleConfirmInputsReview = async () => {
		if (isConfirming) return;
		setIsConfirming(true);
		try {
			if (inputsReviewData && !selectedPayPeriod.isProcessed) {
				await PayrollService.addAlertsAndViolations({
					companyName: company,
					inputsReviewData,
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsConfirming(false);
		}
		handleClick(inputsReviewData);
	};
	const navigate = useNavigate();

	const handleReview = (empPayStub) => {
		openDrawer(empPayStub);
		// navigate(`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.WORKVIEW}`);
	};

	return (
		<HStack alignItems={"end"}>
			<Box overflow="auto" height={"50vh"} w={"100%"} css={tabScrollCss}>
				<Table>
					<Thead position="sticky" top={-1} zIndex="docked">
						<Tr>
							{COLS.map(({ title, value }) => (
								<SortableTh
									key={title}
									sortKey={title.includes("Employee") ? `empId.${value}` : value}
									sortConfig={sortConfig}
									onSort={requestSort}
								>
									<TextTitle size={"md"} title={title} />
								</SortableTh>
							))}
							<Th>
								<Icon as={MdSettingsSuggest} boxSize="5" color="fg.muted" />
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						{(!inputsReviewData || inputsReviewData?.length === 0) && (
							<EmptyRowRecord description="" data={inputsReviewData} colSpan={COLS?.length + 1} />
						)}
						{sortedItems?.map((data) => (
							<Tr key={data._id}>
								{COLS.map(({ title, value, round, nearest }) => (
									<Td key={title}>
										<TextTitle
											title={
												title.includes("Employee")
													? data?.empId?.[value]
													: round
													? getSignedAmount(data[value])
													: nearest
													? convertDecimal(data[value])
													: data[value]
											}
										/>
									</Td>
								))}
								<Td>
									<OutlineButton
										label={"Review payroll details"}
										size={"sm"}
										onClick={() => handleReview(data)}
									/>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>
			<PrimaryButton
				bg="var(--action_status_approve)"
				name={"CONFIRM"}
				rightIcon={<MdCheckCircle />}
				isLoading={isConfirming}
				loadingText="Loading"
				onOpen={handleConfirmInputsReview}
				isDisabled={isPayPeriodInactive}
			/>
			{isOpen && <EmpPayStatement record={record} isOpen={isOpen} onClose={onClose} />}
		</HStack>
	);
};

export default InputsReview;
