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
import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import usePaygroup from "hooks/usePaygroup";
import { MdCheckCircle, MdSettingsSuggest } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";

const InputsReview = ({ handleClick, handleReview }) => {
	const company = LocalStorageService.getItem("selectedCompany");
	const { closestRecord } = usePaygroup(company);
	const inputsReviewData = useEmployeeHoursWorked(company, closestRecord);

	const COLS = [
		"Employee name",
		"Regular Hours",
		"Net Pay",
		"Deductions",
		"Gross Pay",
	];
	return (
		<HStack alignItems={"end"}>
			<Table w={"100%"}>
				<Thead>
					{COLS.map((_) => (
						<Th key={_}>
							<TextTitle size={"md"} title={_} />
						</Th>
					))}

					<Th>
						<Icon as={MdSettingsSuggest} boxSize="5" color="fg.muted" />
					</Th>
					<Th />
				</Thead>
				<Tbody>
					{inputsReviewData?.map((data) => (
						<Tr key={data._id}>
							<Td>
								<TextTitle title={data.empId.fullName} />
							</Td>
							<Td>
								<TextTitle title={data.totalRegHoursWorked} />
							</Td>
							<Td>
								<TextTitle title={data.totalRegHoursWorked} />
							</Td>
							<Td>
								<TextTitle title={data.totalRegHoursWorked} />
							</Td>
							<Td>
								<TextTitle title={data.totalRegHoursWorked} />
							</Td>
							<Td>
								<Button
									variant={"outline"}
									onClick={() => handleReview("John Smith")}
									size={"sm"}
									type="submit"
									color={"var(--primary_button_bg)"}
								>
									Review payroll details
								</Button>
							</Td>
						</Tr>
					))}
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

export default InputsReview;
