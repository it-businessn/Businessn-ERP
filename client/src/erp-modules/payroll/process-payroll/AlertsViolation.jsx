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
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";

const AlertsViolation = ({ handleClick, handleReview }) => {
	const { payNo } = useParams();
	const company = LocalStorageService.getItem("selectedCompany");

	const { payGroupSchedule, closestRecord } = usePaygroup(company);
	const selectedPayPeriod = payNo
		? payGroupSchedule?.find(({ payPeriod }) => payPeriod.toString() === payNo)
		: closestRecord;
	const alertsReviewData = useEmployeeHoursWorked(company, selectedPayPeriod);

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
					{!alertsReviewData?.length && (
						<Tr>
							<Td>
								<TextTitle weight="normal" title={"No record found"} />
							</Td>
						</Tr>
					)}
					{alertsReviewData?.map((data) => (
						<Tr key={data._id}>
							<Td>
								<TextTitle
									weight="normal"
									title={"Banking information missing"}
								/>
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
									bg={"var(--stat_item_color)"}
								>
									Action required
								</Button>
								{/* <Button
									// onClick={onOpen}
									size={"xs"}
									borderRadius={"12px"}
									color={"var(--primary_bg)"}
									bg={"var(--pending)"}
								>
									Pending
								</Button> */}
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
