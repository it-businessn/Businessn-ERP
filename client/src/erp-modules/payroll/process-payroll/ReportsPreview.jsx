import { Button, HStack, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { MdCheckCircle } from "react-icons/md";

const ReportsPreview = () => {
	return (
		<HStack alignItems={"end"}>
			<Table w={"50%"}>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"AUDIT TRAIL"} />
						</Td>

						<Td>
							<Button
								variant={"outline"}
								// onClick={onOpen}
								size={"sm"}
								type="submit"
								color={"var(--primary_button_bg)"}
							>
								Review payroll details
							</Button>
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"COMPANY TOTALS BY HOME DEPARTMENT"} />
						</Td>

						<Td>
							<Button
								variant={"outline"}
								// onClick={onOpen}
								size={"sm"}
								type="submit"
								color={"var(--primary_button_bg)"}
							>
								Review payroll details
							</Button>
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

export default ReportsPreview;
