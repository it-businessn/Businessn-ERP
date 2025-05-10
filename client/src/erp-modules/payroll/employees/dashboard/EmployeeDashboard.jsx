import { SimpleGrid } from "@chakra-ui/react";

import { COMPANIES } from "constant";
import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const EmployeeDashboard = () => {
	const selectedUser = LocalStorageService.getItem("user");
	const { isMobile } = useBreakpointValue();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const [selectedPayGroupOption, setSelectedPayGroupOption] = useState(
		company === COMPANIES.BUSINESSN_ORG ? "Monthly" : null,
	);
	const { selectedPayGroup, closestRecord, payGroupSchedule, closestRecordIndex } = usePaygroup(
		company,
		selectedPayGroupOption,
		false,
	);
	return (
		<PageLayout title="Employee Dashboard" isMobile={isMobile}>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<LeftPane isMobile={isMobile} selectedUser={selectedUser} company={company} />
				{!isMobile && (
					<RightPane
						selectedUser={selectedUser}
						company={company}
						selectedPayGroup={selectedPayGroup}
						payGroupSchedule={payGroupSchedule}
						closestRecord={closestRecord}
						closestRecordIndex={closestRecordIndex}
					/>
				)}
			</SimpleGrid>
		</PageLayout>
	);
};
export default EmployeeDashboard;
