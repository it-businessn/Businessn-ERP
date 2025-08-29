import { Box } from "@chakra-ui/react";
import PageHeader from "components/PageHeader";
import BoxCard from "components/ui/card";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";

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
	isTimesheet,
	showCheckBox,
	size,
	zIndex = 0,
	position = "sticky",
	pb = 0,
	isMobile,
	bg = "var(--primary_bg)",
	showPayGroup,
	hasMultiPaygroups,
	overflow = "hidden",
	overflowY = "auto",
	p = "1em",
	pr,
}) => (
	<Box
		p={p}
		pr={pr}
		mt={isMobile && "1em"}
		overflow={overflow}
		zIndex={zIndex}
		position={position}
		pb={pb}
		bg={bg}
		flex={1}
		overflowY={overflowY}
		css={tabScrollCss}
	>
		<PageHeader
			hasMultiPaygroups={hasMultiPaygroups}
			size={size}
			showSelectBox={showSelectBox}
			showPayGroup={showPayGroup}
			title={title}
			handleChange={handleChange}
			data={data}
			value={selectedValue}
			width={!isMobile && width}
			selectAttr={selectAttr}
			selectPlaceholder={selectPlaceholder}
			isTimesheet={isTimesheet}
			showCheckBox={showCheckBox}
		/>
		{showBgLayer ? (
			<BoxCard pb={pb} borderWidth={"2px"}>
				{children}
			</BoxCard>
		) : (
			children
		)}
	</Box>
);

export default PageLayout;
