import { HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { isExtraPay } from "utils";
import { dayMonthYear } from "utils/convertDate";

const PayrunSetup = ({
	handleClick,
	payGroups,
	selectedPayGroup,
	closestRecord,
	isPayPeriodInactive,
	deptName,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const runType = closestRecord?.isExtraRun ? "Extra" : "Regular";

	const handleConfirm = async () => {
		try {
			if (!closestRecord.isProcessed) {
				setIsLoading(true);
				const response = await PayrollService.addPayPeriodPayStub({
					companyName: company,
					currentPayPeriod: closestRecord,
					deptName,
					selectedPayGroupOption: selectedPayGroup,
				});
				if (response) {
					handleClick();
					setIsLoading(false);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};
	const PAY_DETAILS = [
		{
			detail1: "Pay Period Number",
			detail2: isExtraPay(closestRecord?.payPeriod, closestRecord?.isExtraRun),
		},
		{
			detail1: "Run Type",
			detail2: runType?.toLocaleUpperCase(),
		},
		{
			detail1: "Payment Date",
			detail2: dayMonthYear(closestRecord?.payPeriodPayDate),
		},
		{
			detail1: "Pay Period Start Date",
			detail2: dayMonthYear(closestRecord?.payPeriodStartDate),
		},
		{
			detail1: "Pay Period Ending Date",
			detail2: dayMonthYear(closestRecord?.payPeriodEndDate),
		},
		{
			detail1: "Pay Processing Date",
			detail2: dayMonthYear(closestRecord?.payPeriodProcessingDate),
		},
		{
			detail1: "Email Pay Statement Notifications",
			detail2: "On payday",
		},
	];

	return (
		<HStack alignItems={"end"}>
			<Table w={"100%"}>
				<Thead>
					<Tr>
						<Th>
							<TextTitle size={"md"} title={"Payroll group"} />
						</Th>
						<Th>
							<InputFormControl
								readOnly
								autoComplete="off"
								name="employmentPayGroup"
								valueText={selectedPayGroup}
							/>
						</Th>
					</Tr>
					{(!payGroups || !payGroups?.length) && <EmptyRowRecord data={payGroups} colSpan={2} />}
				</Thead>
				{selectedPayGroup && (
					<Tbody bg={isPayPeriodInactive && "var(--calendar_border)"}>
						{PAY_DETAILS.map(({ detail1, detail2 }, index) => (
							<Tr key={`payDetails_${index}`}>
								<Td>
									<TextTitle title={detail1} />
								</Td>
								<Td>{detail2}</Td>
							</Tr>
						))}
					</Tbody>
				)}
			</Table>
			{payGroups && (
				<PrimaryButton
					bg="var(--action_status_approve)"
					name={"CONFIRM"}
					rightIcon={<MdCheckCircle />}
					isLoading={isLoading}
					isDisabled={isPayPeriodInactive}
					loadingText="Processing..."
					onOpen={handleConfirm}
				/>
			)}
		</HStack>
	);
};

export default PayrunSetup;
