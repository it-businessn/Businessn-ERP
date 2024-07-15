import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const RootLayout = ({ children }) => (
	<Flex minH={"100vh"} as="section">
		{children}
		<main className="main_content">
			<Outlet />
		</main>
	</Flex>
);

export default RootLayout;
