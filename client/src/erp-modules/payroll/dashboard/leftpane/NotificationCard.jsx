import { HStack, Image, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import scheduler from "../../../../assets/Scheduler.png";

const NotificationCard = () => {
	return (
		<BoxCard>
			<VStack spacing={3} alignItems={"start"} w={"100%"}>
				<HStack
					spacing={4}
					justifyContent={"space-between"}
					w={"100%"}
					zIndex={2}
				>
					<PrimaryButton
						minW={"20%"}
						name={"New Feature"}
						loadingText="Loading"
						bg="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
					/>
					<TextTitle
						size={"lg"}
						color={
							"linear-gradient(58deg, rgb(60 91 122)  0%,  transparent 100%)"
						}
						title={"AI Scheduler"}
					/>
				</HStack>
				<NormalTextTitle
					title={
						"Automate manual scheduling processes with AI powered scheduling tools."
					}
					whiteSpace={"wrap"}
					zIndex={2}
				/>
				<Image
					objectFit="contain"
					// position={"relative"}
					height={"100%"}
					w={"100%"}
					src={scheduler}
					alt="Company logo"
				/>
				<TextTitle
					zIndex={2}
					align="end"
					color={"var(--primary_button_bg)"}
					title={"Learn more"}
				/>
			</VStack>
		</BoxCard>
	);
};

export default NotificationCard;
