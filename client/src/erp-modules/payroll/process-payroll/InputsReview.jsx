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
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import useEmployeePayReport from "hooks/useEmployeePayReport";
import { useState } from "react";
import { MdCheckCircle, MdSettingsSuggest } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { convertDecimal, getAmount } from "utils/convertAmt";
import { getClosestRecord } from "../workview/data";
import EmpPayStatement from "./EmpPayStatement";

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
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const selectedPayPeriod = getClosestRecord(payNo, isExtra, payGroupSchedule, closestRecord);

	const inputsReviewData = useEmployeePayReport(
		company,
		selectedPayPeriod,
		isInputsReviewOpen && currentStep === 1,
	);

	const COLS = [
		{ title: "Employee name", value: "fullName" },
		{ title: "Net Income", value: "currentNetPay", round: true },
		{ title: "Gross Income", value: "currentGrossPay", round: true },
		{ title: "Total Hours", value: "totalHoursWorked", nearest: true },
		{ title: "Total Amount", value: "totalAmountAllocated", round: true },
	];

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [record, setRecord] = useState(null);
	const openDrawer = (payslip) => {
		setRecord(payslip);
		onOpen();
	};

	const handleConfirmInputsReview = async () => {
		try {
			if (inputsReviewData && !selectedPayPeriod.isProcessed) {
				await PayrollService.addAlertsAndViolations({
					companyName: company,
					inputsReviewData,
				});
			}
		} catch (error) {
			console.error(error);
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
			<Box overflow="auto" height={"50vh"} w={"100%"}>
				<Table>
					<Thead position="sticky" top={-1} zIndex="docked">
						<Tr>
							{COLS.map(({ title }) => (
								<Th key={title}>
									<TextTitle size={"md"} title={title} />
								</Th>
							))}

							<Th>
								<Icon as={MdSettingsSuggest} boxSize="5" color="fg.muted" />
							</Th>
							<Th />
						</Tr>
					</Thead>
					<Tbody>
						{(!inputsReviewData || inputsReviewData?.length === 0) && (
							<EmptyRowRecord data={inputsReviewData} colSpan={COLS.length} />
						)}
						{inputsReviewData?.map((data) => (
							<Tr key={data._id}>
								{COLS.map(({ title, value, round, nearest }) => (
									<Td key={title}>
										<TextTitle
											title={
												title.includes("Employee")
													? data?.empId?.[value]
													: round
													? getAmount(data[value])
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
				bg="var(--correct_ans)"
				name={"CONFIRM"}
				rightIcon={<MdCheckCircle />}
				// isLoading={isLoading}
				loadingText="Loading"
				onOpen={handleConfirmInputsReview}
				isDisabled={isPayPeriodInactive}
			/>
			{isOpen && <EmpPayStatement record={record} isOpen={isOpen} onClose={onClose} />}
		</HStack>
	);
};

export default InputsReview;
