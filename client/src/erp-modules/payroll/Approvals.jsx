import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TableLayout from "components/ui/table/TableLayout";
import { ROLES } from "constant";
import useCompany from "hooks/useCompany";
import useEmployees from "hooks/useEmployees";
import PageLayout from "layouts/PageLayout";
import LocalStorageService from "services/LocalStorageService";

const Approvals = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const deptName = loggedInUser?.role === ROLES.MANAGER ? loggedInUser?.department : null;
	const { employees } = useEmployees(false, company, null, null, deptName);

	return (
		<PageLayout title={"Approvals"}>
			<TableLayout
				cols={["fullName", "email", "role"]}
				height="75vh"
				// position="sticky"
				// zIndex="docked"
				// top={-1}
			>
				<Tbody>
					{(!employees || employees?.length === 0) && (
						<EmptyRowRecord data={employees} colSpan={3} />
					)}
					{employees?.map(({ fullName, email, _id, role }) => (
						<Tr key={_id}>
							<Td p={0}>{fullName}</Td>
							<Td p={0}>{email}</Td>
							<Td p={0}>{role}</Td>
						</Tr>
					))}
				</Tbody>
			</TableLayout>
		</PageLayout>
	);
};

export default Approvals;
