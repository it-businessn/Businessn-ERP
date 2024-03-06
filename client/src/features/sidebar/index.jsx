import { Flex, Stack } from "@chakra-ui/react";
import MenuItem from "./MenuItem";
import "./Sidebar.css";

const Sidebar = ({ activeMenu }) => {
	return (
		<Flex
			boxShadow="md"
			maxW={{ md: "24vw", lg: "18vw", xl: "15vw" }}
			p={2}
			minW={{ md: "24vw", lg: "18vw", xl: "15vw" }}
			mt="6.7em"
			maxHeight={`calc(100vh - 6.7em)`}
			overflowY="auto"
		>
			<Stack justify="start" width="full" my={0} spacing={0}>
				{activeMenu?.children?.length &&
					activeMenu?.children?.map((menu) => (
						<MenuItem key={crypto.randomUUID()} menu={menu} />
					))}
			</Stack>
		</Flex>
	);
};

export default Sidebar;
