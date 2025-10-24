import { Box } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

const AppointmentHistory = () => {
	return (
		<Box borderTop={"1.5px solid var(--main_color_black)"}>
			<TextTitle color="var(--banner_bg)" p="10px" title={"Coming soon"} />;
			{/* <List spacing={2}>
					<ListItem>
						<BoxCard>
							<NormalTextTitle size="sm" title={"item[label]"} />
						</BoxCard>
					</ListItem>
				</List> */}
		</Box>
	);
};

export default AppointmentHistory;
