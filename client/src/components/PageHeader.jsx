import { Flex } from "@chakra-ui/react";
import SelectBox from "./ui/form/select/SelectBox";
import TextTitle from "./ui/text/TextTitle";

const PageHeader = ({
	showSelectBox,
	title,
	handleChange,
	data,
	value,
	width = "50%",
	selectAttr,
	selectPlaceholder,
}) => (
	<Flex width={width}>
		{title && <TextTitle title={title} mb={"0.5em"} width={width} />}

		{showSelectBox ? (
			<SelectBox
				handleChange={handleChange}
				data={data}
				name={selectAttr || "fullName"}
				border="1px solid var(--primary_button_bg)"
				color={"var(--primary_button_bg)"}
				value={value}
				placeholder={selectPlaceholder || "Select"}
				size={"sm"}
			/>
		) : null}
	</Flex>
);

export default PageHeader;
