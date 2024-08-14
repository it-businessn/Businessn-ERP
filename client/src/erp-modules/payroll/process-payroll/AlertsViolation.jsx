import {
	Button,
	HStack,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";

import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import useEmployeeAlertsInfo from "hooks/useEmployeeAlertsInfo";
import { MdCheckCircle } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_PATH } from "routes";
import LocalStorageService from "services/LocalStorageService";

const AlertsViolation = ({
	handleClick,
	isAlertsOpen,
	currentStep,
	payGroupSchedule,
	closestRecord,
}) => {
	const { payNo } = useParams();
	const company = LocalStorageService.getItem("selectedCompany");

	const selectedPayPeriod = payNo
		? payGroupSchedule?.find(({ payPeriod }) => payPeriod.toString() === payNo)
		: closestRecord;

	const alertsReviewData = useEmployeeAlertsInfo(
		company,
		selectedPayPeriod,
		isAlertsOpen,
		currentStep,
	);
	const isDisabled = alertsReviewData?.find((_) => _.actionRequired);

	const COLS = ["Description", "Employee name", "Status", "Action"];

	const navigate = useNavigate();

	const handleReview = (data) => {
		const empId = data.empId._id;
		const stepNum = data.actionRequired ? 4 : 1;
		navigate(
			`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}/${empId}/${stepNum}`,
		);
	};

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
					{!alertsReviewData?.length && (
						<Tr>
							<Td>
								<TextTitle weight="normal" title={"No record found"} />
							</Td>
						</Tr>
					)}
					{alertsReviewData?.map((data) => (
						<Tr key={data._id}>
							<Td>
								<TextTitle weight="normal" title={data.description} />
							</Td>
							<Td>
								<TextTitle title={data.empId.fullName} />
							</Td>
							<Td>
								{data.actionRequired ? (
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
									label={"Review payroll details"}
									size={"sm"}
									onClick={() => handleReview(data)}
								/>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
			<PrimaryButton
				bg="var(--correct_ans)"
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
