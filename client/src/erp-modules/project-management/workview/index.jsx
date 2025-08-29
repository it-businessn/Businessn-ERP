import { Box } from "@chakra-ui/react";

import useManager from "hooks/useManager";
import PageLayout from "layouts/PageLayout";
import LocalStorageService from "services/LocalStorageService";
import FilesList from "./files";

const WorkView = ({ isDashboard = false }) => {
	const company = LocalStorageService.getItem("selectedCompany");
	const managers = useManager(company);

	return (
		<PageLayout pr={0} title={"File Overview"} showBgLayer overflowY="hidden">
			<Box
				p={0}
				bg={"var(--primary_bg)"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"var(--nav_color)"}
			>
				<FilesList isDashboard={isDashboard} managers={managers} company={company} />
			</Box>
		</PageLayout>
	);
};

export default WorkView;
