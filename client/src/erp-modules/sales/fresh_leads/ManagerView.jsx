import { Tbody, Td, Tr } from "@chakra-ui/react";
import Loader from "components/Loader";
import TableLayout from "components/ui/TableLayout";

const ManagerView = ({ leads }) => {
	const cols = [
		"Opportunity name",
		"Abbr",
		"Company name",
		"Email",
		"Stage",
		// "Supervisor assignee",
		"Industry",
		"Primary assignee",
	];
	return (
		<>
			{!leads && <Loader isAuto />}
			{leads && (
				<TableLayout cols={cols}>
					<Tbody>
						{leads?.map(
							({
								_id,
								abbreviation,
								companyName,
								email,
								opportunityName,
								primaryAssignee,
								stage,
								supervisorAssignee,
								isDisbursedConfirmed,
								industry,
							}) => {
								return (
									<Tr key={_id}>
										<Td>{opportunityName}</Td>
										<Td>{abbreviation}</Td>
										<Td>{companyName}</Td>
										<Td>{email}</Td>
										<Td>{stage === "L1" ? "Fresh Leads" : ""}</Td>
										<Td>{industry}</Td>
										<Td>{primaryAssignee}</Td>
									</Tr>
								);
							},
						)}
					</Tbody>
				</TableLayout>
			)}
		</>
	);
};

export default ManagerView;
