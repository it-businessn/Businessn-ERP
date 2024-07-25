import { Checkbox, HStack, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { MdCheckCircle } from "react-icons/md";

const Finalize = () => {
	return (
		<HStack alignItems={"end"}>
			<Table w={"100%"}>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"Lock Timesheets for Other Users"} />
						</Td>
						<Td>
							<Checkbox
								colorScheme={"facebook"}
								// isChecked={hasChecklist}
								// onChange={() => setHasChecklist(!hasChecklist)}
							/>
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"Do Not Lock Timesheets for Other Users"} />{" "}
						</Td>
						<Td>
							<Checkbox
								border={"1px solid red"}
								colorScheme={"facebook"}
								// isChecked={hasChecklist}
								// onChange={() => setHasChecklist(!hasChecklist)}
							/>
						</Td>
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

export default Finalize;
