import { Flex, useColorModeValue } from "@chakra-ui/react";
import DateTimeFormControl from "./ui/form/DateTimeFormControl";
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
	showDate,
	valueText1,
}) => {
	const themeMode = useColorModeValue(
		"var(--primary_button_bg)",
		"var(--primary_button_bg_dark)",
	);

	return (
		<Flex width={width}>
			{title && <TextTitle title={title} mb={"0.5em"} width={width} />}
			{showDate && (
				<DateTimeFormControl
					label={"Date filter "}
					valueText1={valueText1}
					name1="payDate"
					handleChange={(e) => handleChange(e.target.value)}
					required
				/>
			)}
			{showSelectBox ? (
				<SelectBox
					handleChange={handleChange}
					data={data}
					name={selectAttr || "fullName"}
					border="1px solid var(--primary_button_bg)"
					color={themeMode}
					value={value || ""}
					placeholder={selectPlaceholder || "Select"}
					size={"sm"}
				/>
			) : null}
		</Flex>
	);
};

export default PageHeader;
