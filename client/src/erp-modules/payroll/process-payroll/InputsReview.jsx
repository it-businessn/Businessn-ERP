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
import useEmployeePayReport from "hooks/useEmployeePayReport";
import usePaygroup from "hooks/usePaygroup";
import { MdCheckCircle, MdSettingsSuggest } from "react-icons/md";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";

const InputsReview = ({
	handleClick,
	handleReview,
	isInputsReviewOpen,
	currentStep,
}) => {
	const { payNo } = useParams();

	const company = LocalStorageService.getItem("selectedCompany");

	const { payGroupSchedule, closestRecord } = usePaygroup(company);
	const selectedPayPeriod = payNo
		? payGroupSchedule?.find(({ payPeriod }) => payPeriod.toString() === payNo)
		: closestRecord;

	const inputsReviewData = useEmployeePayReport(
		company,
		selectedPayPeriod,
		isInputsReviewOpen,
		currentStep,
	);
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
					{!inputsReviewData?.length && (
						<Tr>
							<Td>
								<TextTitle weight="normal" title={"No record found"} />
							</Td>
						</Tr>
					)}
					{inputsReviewData?.map((data) => (
						<Tr key={data._id}>
							<Td>
								<TextTitle title={data.empId.fullName} />
							</Td>
							<Td>
								<TextTitle title={data.totalRegHoursWorked} />
							</Td>
							<Td>
								<TextTitle title={data.currentNetPay.toFixed(2)} />
							</Td>
							<Td>
								<TextTitle title={data.currentDeductionsTotal.toFixed(2)} />
							</Td>
							<Td>
								<TextTitle title={data.currentGrossPay.toFixed(2)} />
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
				onOpen={() => handleClick(inputsReviewData)}
			/>
		</HStack>
	);
};

export default InputsReview;
