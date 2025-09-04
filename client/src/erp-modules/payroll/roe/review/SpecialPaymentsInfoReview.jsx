import { FormControl, FormLabel, HStack, Input, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

export const SpecialPaymentsInfoReview = ({ formData }) => {
	return (
		<>
			<TextTitle size="xl" title={"Special Payments"} />
			{formData?.employmentInfo?.specialPayments?.map((p, i) => (
				<VStack key={i} align="stretch" spacing={2} borderWidth="1px" p={3} borderRadius="md">
					<HStack spacing={2} align="end">
						{/* Code */}
						<FormControl>
							<FormLabel>Code</FormLabel>
							<Input value={p.code} />
						</FormControl>

						{/* Start Date */}
						<FormControl>
							<FormLabel>Start Date</FormLabel>
							<Input type="date" value={p.startDate} />
						</FormControl>

						{/* End Date */}
						<FormControl>
							<FormLabel>End Date</FormLabel>
							<Input type="date" value={p.endDate} />
						</FormControl>

						{/* Amount */}
						<FormControl>
							<FormLabel>Amount</FormLabel>
							<Input type="number" step="0.01" value={p.amount} />
						</FormControl>

						{/* Period */}
						<FormControl>
							<FormLabel>Period</FormLabel>
							<Input value={p.period} placeholder="D=Day, W=Week" />
						</FormControl>
					</HStack>
				</VStack>
			))}
		</>
	);
};
