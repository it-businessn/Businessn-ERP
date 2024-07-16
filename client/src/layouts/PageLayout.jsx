import { Box } from "@chakra-ui/react";
import PageHeader from "components/PageHeader";

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
}) => (
	<Box p={{ base: "1em" }} overflow={"hidden"}>
		<PageHeader
			showSelectBox={showSelectBox}
			title={title}
			handleChange={handleChange}
			data={data}
			value={selectedValue}
			width={width}
			selectAttr={selectAttr}
			selectPlaceholder={selectPlaceholder}
		/>
		<Box
			p={showBgLayer && "1em"}
			bg={showBgLayer && "var(--primary_bg)"}
			border={showBgLayer && "2px solid var(--main_color)"}
			borderRadius="10px"
			color={showBgLayer && "var(--nav_color)"}
		>
			{children}
		</Box>
	</Box>
);

export default PageLayout;
