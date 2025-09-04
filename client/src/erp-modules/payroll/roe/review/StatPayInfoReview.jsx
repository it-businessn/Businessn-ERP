import { HStack, Input } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

export const StatPayInfoReview = ({ formData }) => {
	return (
		<>
			<TextTitle size="xl" title={"Statutory Holiday Pay"} />
			{formData?.employmentInfo?.statHolidays?.map((sh, i) => (
				<HStack key={i} spacing={2} align="end">
					<Input type="date" value={sh.date} placeholder="Date" flex={1} />
					<Input type="number" step="0.01" value={sh.amount} placeholder="Amount" flex={1} />
				</HStack>
			))}
		</>
	);
};
