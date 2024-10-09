import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TableLayout from "components/ui/table/TableLayout";
import useCompany from "hooks/useCompany";
import useEmployees from "hooks/useEmployees";
import PageLayout from "layouts/PageLayout";
import LocalStorageService from "services/LocalStorageService";

const Approvals = () => {
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const { employees } = useEmployees(false, company);

	return (
		<PageLayout title={"Approvals"}>
			<TableLayout
				cols={["fullName", "email", "role"]}
				height="75vh"
				position="sticky"
				zIndex="docked"
				top={-1}
			>
				<Tbody>
					{!employees?.length && <EmptyRowRecord />}
					{employees?.map(({ fullName, email, _id, role }) => (
						<Tr key={_id}>
							<Td>{fullName}</Td>
							<Td>{email}</Td>
							<Td>{role}</Td>
						</Tr>
					))}
				</Tbody>
			</TableLayout>
		</PageLayout>
	);
};

export default Approvals;
