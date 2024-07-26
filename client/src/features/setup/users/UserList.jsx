import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
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
		<Box overflow="auto" height={height} fontWeight={"normal"}>
			<Table variant={"simple"} width="100%">
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
					{filteredEmployees.map(
						({ fullName, _id, email, baseModule, group, role }) => (
							<Tr key={_id}>
								<Td
									w={"200px"}
									whiteSpace={"pre-wrap"}
									py={1}
									px={1.5}
									fontSize={"xs"}
								>
									{fullName}
								</Td>
								<Td
									w={"200px"}
									whiteSpace={"pre-wrap"}
									py={1}
									px={1.5}
									fontSize={"xs"}
								>
									{email}
								</Td>
								<Td
									w={"100px"}
									whiteSpace={"pre-wrap"}
									py={1}
									px={1.5}
									fontSize={"xs"}
								>
									{baseModule || ""}
								</Td>
								{!isUser && (
									<Td
										w={"100px"}
										whiteSpace={"pre-wrap"}
										py={1}
										px={1.5}
										fontSize={"xs"}
									>
										{group || ""}
									</Td>
								)}
								<Td
									w={"100px"}
									whiteSpace={"pre-wrap"}
									py={1}
									px={1.5}
									fontSize={"xs"}
								>
									{role}
								</Td>
								<Td>
									{isGroup && (
										<FaRegTrashAlt
											cursor={"pointer"}
											onClick={() => {
												setShowConfirmationPopUp(true);
												setDeleteRecord(_id);
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
