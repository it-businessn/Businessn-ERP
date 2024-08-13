import { Td, Tr } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

const ItemRow = ({
	title,
	rate,
	totalHours,
	currentTotal,
	YTDTotal,
	w = "3em",
}) => (
	<Tr>
		<Td w={"10em"}>
			<TextTitle size={"md"} title={title} />
		</Td>
		<Td w={"3em"}>
			<TextTitle
				size={"md"}
				visibility={rate === 0 && "hidden"}
				title={`$${rate}`}
				weight="normal"
			/>
		</Td>
		<Td w={w}>
			<TextTitle
				size={"md"}
				visibility={totalHours === 0 && "hidden"}
				title={totalHours}
				weight="normal"
			/>
		</Td>
		<Td w={"10em"}>
			<TextTitle
				size={"md"}
				title={`$${currentTotal.toFixed(2)}`}
				weight="normal"
			/>
		</Td>
		<Td w={"10em"}>
			<TextTitle
				size={"md"}
				title={`$${YTDTotal.toFixed(2)}`}
				weight="normal"
			/>
		</Td>
	</Tr>
);

export default ItemRow;
