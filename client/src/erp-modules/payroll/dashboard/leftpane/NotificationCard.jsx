import { VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

const NotificationCard = () => {
	return (
		<VStack spacing={3} alignItems={"start"}>
			<VStack spacing={1}>
				<TextTitle title={"Next public holiday"} />
				<NormalTextTitle title={"Sunday - Jul 4, 2024"} />
			</VStack>
			<VStack spacing={1}>
				<TextTitle title={"Next public holiday"} />
				<NormalTextTitle title={"Sunday - Jul 4, 2024"} />
			</VStack>
			<VStack spacing={1}>
				<TextTitle title={"Next public holiday"} />
				<NormalTextTitle title={"Sunday - Jul 4, 2024"} />
			</VStack>
		</VStack>
	);
};

export default NotificationCard;
