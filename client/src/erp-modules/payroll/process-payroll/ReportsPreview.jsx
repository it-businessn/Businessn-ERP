import { Button, HStack, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { MdCheckCircle } from "react-icons/md";

const ReportsPreview = ({ handleClick, handleReview }) => {
	return (
		<HStack alignItems={"end"}>
			<Table w={"100%"}>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"Payroll Register".toUpperCase()} />
						</Td>

						<Td>
							<Button
								variant={"outline"}
								// onClick={onOpen}
								size={"sm"}
								type="submit"
								color={"var(--primary_button_bg)"}
							>
								Preview report
							</Button>
						</Td>
					</Tr>
				</Tbody>
			</Table>
			<PrimaryButton
				bg="var(--correct_ans)"
				name={"CONFIRM"}
				rightIcon={<MdCheckCircle />}
				// isLoading={isLoading}
				loadingText="Loading"
				onOpen={handleClick}
			/>
		</HStack>
	);
};

export default ReportsPreview;
