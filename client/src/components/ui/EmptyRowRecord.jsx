import { Progress, Td, Tr } from "@chakra-ui/react";
import SkeletonLoader from "components/SkeletonLoader";
import NormalTextTitle from "./NormalTextTitle";

const EmptyRowRecord = ({ title = "No record found", px, data, colSpan, progress }) => (
	<Tr>
		<Td px={px} colSpan={colSpan}>
			{data?.length === 0 ? (
				<NormalTextTitle size="sm" title={title} />
			) : progress ? (
				<Progress value={progress} colorScheme="blue" hasStripe />
			) : (
				<SkeletonLoader />
			)}
		</Td>
	</Tr>
);

export default EmptyRowRecord;
