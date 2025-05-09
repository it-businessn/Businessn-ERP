import { Checkbox, HStack, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { MdCheckCircle } from "react-icons/md";

const Finalize = ({ handleClick, isPayPeriodInactive }) => {
	const [hasChecklist, setHasChecklist] = useState(false);
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
								isChecked={hasChecklist}
								onChange={() => setHasChecklist(!hasChecklist)}
							/>
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"Do Not Lock Timesheets for Other Users"} />
						</Td>
						<Td>
							<Checkbox
								border={"1px solid red"}
								colorScheme={"facebook"}
								isChecked={!hasChecklist}
								onChange={() => setHasChecklist(!hasChecklist)}
							/>
						</Td>
					</Tr>
				</Tbody>
			</Table>
			<PrimaryButton
				bg="var(--action_status_approve)"
				name={"CONFIRM"}
				rightIcon={<MdCheckCircle />}
				loadingText="Loading"
				onOpen={handleClick}
				isDisabled={isPayPeriodInactive}
			/>
		</HStack>
	);
};

export default Finalize;
