import { Button, HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { ALERTS_TYPE } from "constant";
import useCompany from "hooks/useCompany";
import useEmployeeAlertsInfo from "hooks/useEmployeeAlertsInfo";
import { MdCheckCircle } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_PATH } from "routes";
import LocalStorageService from "services/LocalStorageService";
import { getClosestRecord } from "../workview/data";

const AlertsViolation = ({
	handleClick,
	isAlertsOpen,
	currentStep,
	payGroupSchedule,
	closestRecord,
	isPayPeriodInactive,
	selectedPayGroup,
}) => {
	const { payNo } = useParams();
	const isExtra = payNo?.includes("E");

	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const selectedPayPeriod = getClosestRecord(payNo, isExtra, payGroupSchedule, closestRecord);

	const alertsReviewData = useEmployeeAlertsInfo(
		company,
		selectedPayPeriod,
		isAlertsOpen,
		currentStep,
		selectedPayGroup,
	);
	const COLS = ["Description", "Employee name", "Status", "Action"];

	const navigate = useNavigate();

	const handleReview = (data) => {
		const empId = data?.empId?._id;
		const stepNum = data?.actionRequired ? (data?.type === ALERTS_TYPE.WAGE ? 2 : 5) : 0;
		navigate(`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}/info/${empId}/${stepNum}`);
	};
	const filteredEmp = [];
	const isExtraRun = closestRecord?.isExtraRun;

	if (isExtraRun && alertsReviewData) {
		const selectedEmp = closestRecord.selectedEmp;
		selectedEmp.forEach((emp) => {
			const empExists = alertsReviewData?.find((_) => _.empId.fullName === emp);
			if (empExists) {
				filteredEmp.push(empExists);
			}
		});
	}
	const data = isExtraRun ? filteredEmp : alertsReviewData;
	const isDisabled = data?.find((_) => _.actionRequired) || isPayPeriodInactive;

	return (
		<HStack alignItems={"end"}>
			<Table w={"100%"}>
				<Thead>
					<Tr>
						{COLS.map((_) => (
							<Th key={_}>
								<TextTitle size={"md"} title={_} />
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{(!data || data?.length === 0) && (
						<EmptyRowRecord title="No violations found" data={data} colSpan={COLS.length} />
					)}
					{data?.map((record) => (
						<Tr key={record._id}>
							<Td>
								<NormalTextTitle title={record?.description} />
							</Td>
							<Td>
								<TextTitle title={record?.empId?.fullName} />
							</Td>
							<Td>
								{record.actionRequired ? (
									<Button
										size={"sm"}
										borderRadius={"10px"}
										color={"var(--primary_bg)"}
										bg={"var(--incorrect_ans)"}
									>
										Action required
									</Button>
								) : (
									<Button
										size={"sm"}
										borderRadius={"10px"}
										color={"var(--primary_bg)"}
										bg={"var(--pending)"}
									>
										Attention Needed
									</Button>
								)}
							</Td>
							<Td>
								<OutlineButton
									label="Address violation"
									size={"sm"}
									onClick={() => handleReview(record)}
								/>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
			<PrimaryButton
				bg="var(--action_status_approve)"
				name={"CONFIRM"}
				rightIcon={<MdCheckCircle />}
				isDisabled={isDisabled}
				loadingText="Loading"
				onOpen={handleClick}
			/>
		</HStack>
	);
};

export default AlertsViolation;
