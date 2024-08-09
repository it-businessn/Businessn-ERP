import { Button, HStack, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import usePaygroup from "hooks/usePaygroup";
import { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import PreviewReportsModal from "./preview-reports/PreviewReportsModal";

const ReportsPreview = ({ handleClick, handleReview }) => {
	const [showReport, setShowReport] = useState(undefined);
	const company = LocalStorageService.getItem("selectedCompany");
	const { closestRecord } = usePaygroup(company);

	//addpaystubs on payrol period activation
	const handleAdd = async () => {
		try {
			await PayrollService.addPayPeriodPayStub({
				companyName: company,
				currentPayPeriod: closestRecord,
			});
		} catch (error) {
			console.error(error);
		}
	};
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
								onClick={() => setShowReport(true)}
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
			<PreviewReportsModal
				isOpen={showReport}
				onClose={() => setShowReport(false)}
			/>

			<PrimaryButton
				bg="var(--correct_ans)"
				name={"CONFIRM"}
				rightIcon={<MdCheckCircle />}
				isDisabled={showReport === undefined}
				loadingText="Loading"
				onOpen={handleClick}
			/>
		</HStack>
	);
};

export default ReportsPreview;
