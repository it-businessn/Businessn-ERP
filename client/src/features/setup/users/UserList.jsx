import { Box, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useSortableData from "hooks/useSortableData";
import { FaRegTrashAlt } from "react-icons/fa";

// TABLE-SORT: sort by what each cell shows
const sortByName = ({ empId, fullName }) => empId?.fullName || fullName;
const sortByEmail = ({ personalEmail, email }) => personalEmail || email;
const sortByBaseModule = ({ baseModule }) => baseModule || baseModule?.[0] || "Payroll";
const sortByRole = ({ employmentRole, role }) => employmentRole || role;

const UserList = ({
	filteredEmployees,
	setDeleteRecord,
	setShowConfirmationPopUp,
	isGroup,
	isUser,
	height,
}) => {
	const { sortedItems, sortConfig, requestSort } = useSortableData(filteredEmployees);
	return (
		<Box css={tabScrollCss} overflow="auto" height={height} fontWeight={"normal"}>
			<Table variant={"simple"} width="100%" position="sticky" top={-1} zIndex={0}>
				<Thead>
					<Tr>
						<SortableTh sortKey={sortByName} sortConfig={sortConfig} onSort={requestSort} px={1.5} w={"200px"}>
							Name
						</SortableTh>
						<SortableTh sortKey={sortByEmail} sortConfig={sortConfig} onSort={requestSort} px={1.5} w={"200px"}>
							Email
						</SortableTh>
						<SortableTh sortKey={sortByBaseModule} sortConfig={sortConfig} onSort={requestSort} px={1.5} w={"200px"}>
							Base Module
						</SortableTh>
						{!isUser && (
							<SortableTh sortKey="group" sortConfig={sortConfig} onSort={requestSort} px={1.5} w={"200px"}>
								Team
							</SortableTh>
						)}
						<SortableTh sortKey={sortByRole} sortConfig={sortConfig} onSort={requestSort} px={1.5} w={"200px"}>
							Role
						</SortableTh>
						<Th px={1.5} w={"100px"}></Th>
					</Tr>
				</Thead>
				<Tbody>
					{(!filteredEmployees || filteredEmployees?.length === 0) && (
						<EmptyRowRecord data={filteredEmployees} colSpan={isUser ? 5 : 6} />
					)}
					{sortedItems?.map(
						({
							empId,
							personalEmail,
							baseModule,
							group,
							employmentRole,
							_id,
							fullName,
							email,
							role,
						}) => (
							<Tr key={_id || empId?._id}>
								<Td w={"200px"} whiteSpace={"pre-wrap"} py={1} px={1.5} fontSize={"xs"}>
									{empId?.fullName || fullName}
								</Td>
								<Td w={"200px"} whiteSpace={"pre-wrap"} py={1} px={1.5} fontSize={"xs"}>
									{personalEmail || email}
								</Td>
								<Td w={"100px"} whiteSpace={"pre-wrap"} py={1} px={1.5} fontSize={"xs"}>
									{baseModule || baseModule?.[0] || "Payroll"}
								</Td>
								{!isUser && (
									<Td w={"100px"} whiteSpace={"pre-wrap"} py={1} px={1.5} fontSize={"xs"}>
										{group || ""}
									</Td>
								)}
								<Td w={"100px"} whiteSpace={"pre-wrap"} py={1} px={1.5} fontSize={"xs"}>
									{employmentRole || role}
								</Td>
								<Td>
									{isGroup && (
										<IconButton
											aria-label="Delete"
											icon={<FaRegTrashAlt />}
											variant="ghost"
											size="sm"
											onClick={() => {
												setShowConfirmationPopUp(true);
												setDeleteRecord(empId?._id || _id);
											}}
										/>
									)}
								</Td>
							</Tr>
						),
					)}
				</Tbody>
			</Table>
		</Box>
	);
};

export default UserList;
