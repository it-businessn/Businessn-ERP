import { HStack, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import PreviewReportsModal from "./preview-reports/PreviewReportsModal";

const ReportsPreview = ({ handleClick, reportData }) => {
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
							<OutlineButton
								label={"Preview report"}
								size={"sm"}
								onClick={() => setShowReport(true)}
							/>
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
