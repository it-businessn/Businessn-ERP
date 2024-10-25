import { Td, Tr } from "@chakra-ui/react";
import SkeletonLoader from "components/SkeletonLoader";
import NormalTextTitle from "./NormalTextTitle";

const EmptyRowRecord = ({ title = "No record found", data, colSpan }) => (
	<Tr>
		<Td colSpan={colSpan}>
			{data?.length === 0 ? (
				<NormalTextTitle size="sm" title={title} />
			) : (
				<SkeletonLoader />
			)}
		</Td>
	</Tr>
);

export default EmptyRowRecord;
