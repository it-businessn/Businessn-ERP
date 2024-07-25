import { HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import SelectBox from "components/ui/form/select/SelectBox";
import TextTitle from "components/ui/text/TextTitle";
import usePaygroup from "hooks/usePaygroup";
import { MdCheckCircle } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";
import { dayMonthYear } from "utils";

const PayrunSetup = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const { payGroups, selectedPayGroup, payGroupSchedule } =
		usePaygroup(company);

	return (
		<HStack alignItems={"end"}>
			<Table w={"100%"}>
				<Thead>
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
				</Thead>
				{selectedPayGroup && (
					<Tbody>
						<Tr>
							<Td>
								<TextTitle title={"Pay Period Number"} />
							</Td>
							<Td>12</Td>
						</Tr>
						<Tr>
							<Td>
								<TextTitle title="Run Type" />
							</Td>
							<Td>{"Regular".toLocaleUpperCase()}</Td>
						</Tr>
						<Tr>
							<Td>
								<TextTitle title="Payment Date" />
							</Td>
							<Td>{dayMonthYear(payGroupSchedule?.payDate)}</Td>
						</Tr>
						<Tr>
							<Td>
								<TextTitle title="Pay Period Ending Date" />
							</Td>
							<Td>{dayMonthYear(payGroupSchedule?.endDate)}</Td>
						</Tr>
						<Tr>
							<Td>
								<TextTitle title="Pay Processing Date" />
							</Td>
							<Td>{dayMonthYear(payGroupSchedule?.processingDate)}</Td>
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
				isDisabled={true}
				name={"CONFIRM"}
				rightIcon={<MdCheckCircle />}
				// isLoading={isLoading}
				loadingText="Loading"
			/>
		</HStack>
	);
};

export default PayrunSetup;
