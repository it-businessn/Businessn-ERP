import { Box, Flex, Progress, Td, Tr } from "@chakra-ui/react";
import SkeletonLoader from "components/SkeletonLoader";
import NormalTextTitle from "./NormalTextTitle";

const EmptyRowRecord = ({
	title = "No record found",
	description = "Add record to see them listed here",
	px,
	data,
	colSpan,
	progress,
}) => (
	<Tr>
		<Td px={px} colSpan={colSpan}>
			{data?.length === 0 ? (
				<Flex direction="column" align="center" justify="center" py={5} color="gray.500">
					<Box fontSize="lg" mb={2}>
						{title}
					</Box>
					<NormalTextTitle align={"center"} size="sm" title={description} />
				</Flex>
			) : progress ? (
				<Progress value={progress} colorScheme="blue" hasStripe />
			) : (
				<SkeletonLoader />
			)}
		</Td>
	</Tr>
);

export default EmptyRowRecord;
