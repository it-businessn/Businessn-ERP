import { SimpleGrid } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { ACTIVITY_CARDS } from "../customers/contacts/logs/data";
import Activity from "./Activity";

const LeftPane = ({ setShowSelectCustomer, setLogType }) => (
	<SimpleGrid
		columns={1}
		spacing={4}
		templateRows={{ lg: "1% 8% 8% 8% 8% 8% 8%" }}
	>
		<TextTitle title={"Activities"} />
		{ACTIVITY_CARDS.map((activity) => (
			<Activity
				activity={activity}
				key={activity.title}
				target={activity.target1}
				width={{ base: "50%", md: "40%", lg: "40%", xl: "40%" }}
				onClick={() => {
					setLogType(activity.value);
					setShowSelectCustomer(true);
				}}
			/>
		))}
	</SimpleGrid>
);

export default LeftPane;
