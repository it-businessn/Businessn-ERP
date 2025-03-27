import { HStack } from "@chakra-ui/react";
import PrimaryButton from "./button/PrimaryButton";
import NormalTextTitle from "./NormalTextTitle";

const Pagination = ({ pageNum, setPageNum, totalPage }) => {
	return (
		<HStack>
			<PrimaryButton
				size="sm"
				isDisabled={pageNum === 1}
				name="Prev"
				onOpen={() => setPageNum(pageNum - 1)}
			/>

			<NormalTextTitle align="center" width="200px" title={`Page ${pageNum} of ${totalPage}`} />
			<PrimaryButton
				size="sm"
				isDisabled={pageNum === totalPage}
				name="Next"
				onOpen={() => setPageNum(pageNum + 1)}
			/>
		</HStack>
	);
};

export default Pagination;
