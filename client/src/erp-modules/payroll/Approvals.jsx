import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TableLayout from "components/ui/table/TableLayout";
import useCompany from "hooks/useCompany";
import useEmployees from "hooks/useEmployees";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import LocalStorageService from "services/LocalStorageService";
import { getDeptName } from "utils";

const Approvals = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const { selectedPayGroup } = usePaygroup(company, false);
	const { employees } = useEmployees(
		false,
		company,
		null,
		null,
		getDeptName(loggedInUser),
		selectedPayGroup?.name,
	);

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
