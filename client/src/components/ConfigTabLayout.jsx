import { Box, Grid, Stack, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import BoxCard from "./ui/card";

export const ConfigTabLayout = ({ leftContent, tableData, tableTitle, tableContent }) => {
	return (
		<Grid templateColumns={{ base: "1fr", lg: "0.3fr 0.7fr" }} gap={6}>
			<BoxCard bg="white">
				<VStack spacing={4} align="stretch">
					{leftContent}
				</VStack>
			</BoxCard>

			{tableData && (
				<BoxCard bg="white">
					<Stack spacing={4}>
						<TextTitle align={"center"} title={tableTitle} />
						<Box overflowY={"auto"} h={"calc(100vh - 325px)"}>
							{tableContent}
						</Box>
					</Stack>
				</BoxCard>
			)}
		</Grid>
	);
};
