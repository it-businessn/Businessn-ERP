import { FormLabel, HStack, Stack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { getAmount } from "utils/convertAmt";

export const OccupationInfo = ({ formData }) => {
	return (
		<Stack spacing={3} p={5}>
			<TextTitle size="xl" title={"Occupation"} />
			{formData?.employmentInfo?.positions?.map((position, index) => (
				<BoxCard key={`${position?.title}_${index}`} spacing={2}>
					<HStack>
						<FormLabel w="100%" fontWeight="bold">
							Position:
							<NormalTextTitle title={position?.title || ""} />
						</FormLabel>
						<FormLabel w="100%" fontWeight="bold">
							Payrate:
							<NormalTextTitle title={getAmount(position?.payRate) || ""} />
						</FormLabel>
					</HStack>

					<FormLabel>
						Linked Time Management Badge ID:
						<NormalTextTitle title={position?.timeManagementBadgeID || "NA"} />
					</FormLabel>
				</BoxCard>
			))}
		</Stack>
	);
};
