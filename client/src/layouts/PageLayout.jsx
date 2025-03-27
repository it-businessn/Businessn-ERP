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
	valueText1,
	isTimesheet,
	showCheckBox,
	size,
	zIndex = 0,
	position = "sticky",
	pb,
}) => (
	<Box p={{ base: "1em" }} overflow={"hidden"} zIndex={zIndex} position={position} pb={pb}>
		<PageHeader
			size={size}
			valueText1={valueText1}
			showSelectBox={showSelectBox}
			title={title}
			handleChange={handleChange}
			data={data}
			value={selectedValue}
			width={width}
			selectAttr={selectAttr}
			selectPlaceholder={selectPlaceholder}
			isTimesheet={isTimesheet}
			showCheckBox={showCheckBox}
		/>
		{showBgLayer ? <BoxCard borderWidth={"2px"}>{children}</BoxCard> : children}
	</Box>
);

export default PageLayout;
