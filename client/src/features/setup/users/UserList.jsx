import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { FaRegTrashAlt } from "react-icons/fa";

const UserList = ({
	filteredEmployees,
	setDeleteRecord,
	setShowConfirmationPopUp,
	isGroup,
	isUser,
	height,
}) => {
	return (
		<Box css={tabScrollCss} overflow="auto" height={height} fontWeight={"normal"}>
			<Table variant={"simple"} width="100%" position="sticky" top={-1} zIndex={0}>
				<Thead>
					<Tr>
						<Th px={1.5} w={"200px"}>
							Name
						</Th>
						<Th px={1.5} w={"200px"}>
							Email
						</Th>
						<Th px={1.5} w={"200px"}>
							Base Module
						</Th>
						{!isUser && (
							<Th px={1.5} w={"200px"}>
								Team
							</Th>
						)}
						<Th px={1.5} w={"200px"}>
							Role
						</Th>
						<Th px={1.5} w={"100px"}></Th>
					</Tr>
				</Thead>
				<Tbody>
					{(!filteredEmployees || filteredEmployees?.length === 0) && (
						<EmptyRowRecord data={filteredEmployees} colSpan={5} />
					)}
					{filteredEmployees?.map(
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
							<Tr key={empId?._id}>
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
										<FaRegTrashAlt
											cursor={"pointer"}
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
