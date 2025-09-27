import { Box, HStack, Stack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

export const ConfigTabLayout = ({ leftContent, tableData, tableTitle, tableContent }) => {
	return (
		<HStack alignItems={"flex-start"}>
			<Box flex={0.3}>
				<Stack p="1em">{leftContent}</Stack>
			</Box>
			{tableData && (
				<Box flex={0.3}>
					<Stack p="1em">
						<TextTitle align={"center"} title={tableTitle} />
						<Box h={"calc(100vh - 280px)"} overflowY={"auto"}>
							{tableContent}
						</Box>
					</Stack>
				</Box>
			)}
		</HStack>
	);
};
