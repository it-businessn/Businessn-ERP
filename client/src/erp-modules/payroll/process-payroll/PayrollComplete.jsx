import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Stack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

// Before submission: ready to submit. After: payroll processed + the VoPay
// fund transfer result (result.transfer from getFundTransferToast in index.jsx).
const PayrollComplete = ({ result }) => {
	if (!result) {
		return (
			<TextTitle
				mt="2em"
				title={"Payroll is ready for final submission. Submit payroll to complete payrun."}
			/>
		);
	}
	const { transfer } = result;
	return (
		<Stack mt="2em" spacing={4}>
			<TextTitle color="green" title={"Payroll is processed for payrun."} />
			{transfer && (
				<Alert status={transfer.status} borderRadius="md" alignItems="start">
					<AlertIcon />
					<Box>
						<AlertTitle>{transfer.title}</AlertTitle>
						<AlertDescription>{transfer.description}</AlertDescription>
					</Box>
				</Alert>
			)}
		</Stack>
	);
};

export default PayrollComplete;
