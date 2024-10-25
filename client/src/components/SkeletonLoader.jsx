import { SkeletonText } from "@chakra-ui/react";
import NormalTextTitle from "./ui/NormalTextTitle";

const SkeletonLoader = () => (
	<>
		<NormalTextTitle size="sm" title="Loading in progress... Almost there!" />
		<SkeletonText noOfLines={3} />
	</>
);

export default SkeletonLoader;
