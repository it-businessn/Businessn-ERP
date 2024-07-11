import {
	Button,
	HStack,
	Icon,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { MdCheckCircle, MdSettingsSuggest } from "react-icons/md";

const DetailsReview = () => {
	return (
		<HStack alignItems={"end"}>
			<Table w={"60%"}>
				<Thead>
					<Th>
						<TextTitle size={"md"} title={"Employee name"} />
					</Th>
					<Th>
						<TextTitle size={"md"} title={"Net Pay"} />
					</Th>
					<Th>
						<TextTitle size={"md"} title={"Deductions"} />
					</Th>
					<Th>
						<TextTitle size={"md"} title={"Gross Pay"} />
					</Th>
					<Th>
						<Icon as={MdSettingsSuggest} boxSize="5" color="fg.muted" />
					</Th>
					<Th />
				</Thead>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"John Smith"} />
						</Td>
						<Td>
							<TextTitle title={"$1,345.00"} />
						</Td>
						<Td />
						<Td />
						<Td />
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
							<TextTitle title={"John Smith"} />
						</Td>
						<Td>
							<TextTitle title={"$1,345.00"} />
						</Td>
						<Td />
						<Td />
						<Td />
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

export default DetailsReview;
