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
import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import usePaygroup from "hooks/usePaygroup";
import { MdCheckCircle } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";

const AlertsViolation = ({ handleClick, handleReview }) => {
	const company = LocalStorageService.getItem("selectedCompany");
	const { closestRecord } = usePaygroup(company);
	const alertsReviewData = useEmployeeHoursWorked(company, closestRecord);

	const COLS = ["Description", "Employee name", "Status", "Action"];
	return (
		<HStack alignItems={"end"}>
			<Table w={"100%"}>
				<Thead>
					{COLS.map((_) => (
						<Th key={_}>
							<TextTitle size={"md"} title={_} />
						</Th>
					))}
				</Thead>
				<Tbody>
					{alertsReviewData?.map((data) => (
						<Tr key={data._id}>
							<Td>
								<TextTitle title={data._id} />
							</Td>
							<Td>
								<TextTitle title={data.empId.fullName} />
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
									onClick={handleReview}
									size={"sm"}
									type="submit"
									color={"var(--primary_button_bg)"}
								>
									Review payroll details
								</Button>
							</Td>
						</Tr>
					))}

					{/* <Tr>
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
					</Tr> */}
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

export default AlertsViolation;
