import { Box } from "@chakra-ui/react";
import PageHeader from "components/PageHeader";
import BoxCard from "components/ui/card";

const PageLayout = ({
	children,
	showSelectBox,
	title,
	handleChange,
	data,
	selectedValue,
	width,
	showBgLayer,
	selectAttr,
	selectPlaceholder,
	showDate,
	valueText1,
}) => (
	<Box p={{ base: "1em" }} overflow={"hidden"}>
		<PageHeader
			showDate={showDate}
			valueText1={valueText1}
			showSelectBox={showSelectBox}
			title={title}
			handleChange={handleChange}
			data={data}
			value={selectedValue}
			width={width}
			selectAttr={selectAttr}
			selectPlaceholder={selectPlaceholder}
		/>
		{showBgLayer ? <BoxCard borderWidth={"2px"}>{children}</BoxCard> : children}
	</Box>
);

export default PageLayout;
