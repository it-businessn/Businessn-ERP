import { HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import SelectBox from "components/ui/form/select/SelectBox";
import TextTitle from "components/ui/text/TextTitle";
import { MdCheckCircle } from "react-icons/md";

const PayrunSetup = () => {
	return (
		<HStack alignItems={"end"}>
			<Table w={"60%"}>
				<Thead>
					<Th>
						<TextTitle size={"md"} title={"Payroll group"} />
					</Th>
					<Th>
						<SelectBox
							// handleChange={handleChange}
							data={["Canada District 1"]}
							name="name"
							border="1px solid var(--primary_button_bg)"
							color={"var(--primary_button_bg)"}
							value={"Canada District 1"}
							placeholder="Canada District 1"
							size={"sm"}
						/>
					</Th>
				</Thead>
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
						<Td>Fri Jul 14, 2024</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title="Pay Period Ending Date" />
						</Td>
						<Td>Fri Jul 14, 2024</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title="Pay Processing Date" />
						</Td>
						<Td>Fri Jul 14, 2024</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title="Email Pay Statement Notifications" />
						</Td>
						<Td>On payday</Td>
					</Tr>
				</Tbody>
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
