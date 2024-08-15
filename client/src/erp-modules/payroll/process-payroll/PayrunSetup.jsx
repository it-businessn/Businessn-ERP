import { HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import SelectBox from "components/ui/form/select/SelectBox";
import TextTitle from "components/ui/text/TextTitle";
import { MdCheckCircle } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { dayMonthYear, isExtraPay } from "utils";

const PayrunSetup = ({
	handleClick,
	payGroups,
	selectedPayGroup,
	closestRecord,
	isPayPeriodInactive,
}) => {
	const company = LocalStorageService.getItem("selectedCompany");
	const runType = closestRecord?.isExtraRun ? "Extra" : "Regular";

	const handleConfirm = async () => {
		try {
			if (!closestRecord.isProcessed) {
				await PayrollService.addPayPeriodPayStub({
					companyName: company,
					currentPayPeriod: closestRecord,
				});
			}
			handleClick();
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<HStack alignItems={"end"}>
			<Table w={"100%"}>
				<Thead>
					<Tr>
						<Th>
							<TextTitle size={"md"} title={"Payroll group"} />
						</Th>
						<Th>
							<SelectBox
								// handleChange={handleChange}
								data={payGroups}
								name="name"
								border="1px solid var(--primary_button_bg)"
								color={"var(--primary_button_bg)"}
								value={selectedPayGroup?.name}
								placeholder="Select Paygroup"
								size={"sm"}
							/>
						</Th>
					</Tr>
				</Thead>
				{selectedPayGroup && (
					<Tbody bg={isPayPeriodInactive && "var(--calendar_border)"}>
						<Tr>
							<Td>
								<TextTitle title={"Pay Period Number"} />
							</Td>
							<Td>
								{isExtraPay(
									closestRecord?.payPeriod,
									closestRecord?.isExtraRun,
								)}
							</Td>
						</Tr>
						<Tr>
							<Td>
								<TextTitle title="Run Type" />
							</Td>
							<Td>{runType?.toLocaleUpperCase()}</Td>
						</Tr>
						<Tr>
							<Td>
								<TextTitle title="Payment Date" />
							</Td>
							<Td>{dayMonthYear(closestRecord?.payPeriodPayDate)}</Td>
						</Tr>
						<Tr>
							<Td>
								<TextTitle title="Pay Period Ending Date" />
							</Td>
							<Td>{dayMonthYear(closestRecord?.payPeriodEndDate)}</Td>
						</Tr>
						<Tr>
							<Td>
								<TextTitle title="Pay Processing Date" />
							</Td>
							<Td>{dayMonthYear(closestRecord?.payPeriodProcessingDate)}</Td>
						</Tr>
						<Tr>
							<Td>
								<TextTitle title="Email Pay Statement Notifications" />
							</Td>
							<Td>On payday</Td>
						</Tr>
					</Tbody>
				)}
			</Table>
			<PrimaryButton
				bg="var(--correct_ans)"
				name={"CONFIRM"}
				rightIcon={<MdCheckCircle />}
				// isLoading={isLoading}
				isDisabled={isPayPeriodInactive}
				loadingText="Loading"
				onOpen={handleConfirm}
			/>
		</HStack>
	);
};

export default PayrunSetup;
