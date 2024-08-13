import { Button, HStack, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import PreviewReportsModal from "./preview-reports/PreviewReportsModal";

const ReportsPreview = ({ handleClick, handleReview, reportData }) => {
	const [showReport, setShowReport] = useState(undefined);

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
				reportData={reportData}
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
