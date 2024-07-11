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
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { MdCheckCircle } from "react-icons/md";

const AlertsViolation = () => {
	return (
		<HStack alignItems={"end"}>
			<Table w={"60%"}>
				<Thead>
					<Th>
						<TextTitle size={"md"} title={"Alerts"} />
					</Th>
					<Th>
						<TextTitle size={"md"} title={"Description"} />
					</Th>
					<Th>
						<TextTitle size={"md"} title={"Status"} />
					</Th>
					<Th>
						<TextTitle size={"md"} title={"Action"} />
					</Th>
				</Thead>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"John Smith"} />
						</Td>
						<Td>
							<TextTitle title={"$1,345.00"} />
						</Td>
						<Td>
							<Button
								// onClick={onOpen}
								size={"xs"}
								borderRadius={"12px"}
								color={"var(--primary_bg)"}
								bg={"var(--pending)"}
							>
								Pending
							</Button>
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
							<TextTitle title={"John Smith"} />
						</Td>
						<Td>
							<TextTitle title={"$1,345.00"} />
						</Td>

						<Td>
							<Button
								// onClick={onOpen}
								size={"xs"}
								borderRadius={"12px"}
								color={"var(--primary_bg)"}
								bg={"var(--stat_item_color)"}
							>
								Action required
							</Button>
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

export default AlertsViolation;
