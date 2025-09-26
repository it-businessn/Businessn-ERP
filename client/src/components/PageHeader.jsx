import { Flex, FormControl, useColorModeValue } from "@chakra-ui/react";
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
	isTimesheet,
	showCheckBox,
	size,
	showPayGroup,
	hasMultiPaygroups,
	mobileTitlePadding,
}) => {
	const themeMode = useColorModeValue("var(--primary_button_bg)", "var(--primary_button_bg_dark)");
	return (
		<Flex width={{ base: "100%", md: width }}>
			{title && (
				<TextTitle
					title={title}
					mb={mobileTitlePadding ? 0 : "0.5em"}
					size={size}
					width={width}
					p={mobileTitlePadding}
					// width={isTimesheet ? "auto" : width}
				/>
			)}
			{/* {isTimesheet ? showCheckBox : <></>} */}
			{showPayGroup && (
				<>
					{hasMultiPaygroups ? (
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
					) : (
						<FormControl>
							<TextTitle
								p={1}
								width="200px"
								size="sm"
								align="center"
								borderRadius="5px"
								border="1px solid var(--calendar_border)"
								title={value}
								weight="normal"
							/>
						</FormControl>
					)}
				</>
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
