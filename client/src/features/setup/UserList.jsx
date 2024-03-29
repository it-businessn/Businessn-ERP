import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

const UserList = ({ filteredEmployees }) => {
	return (
		<Table variant="simple" width="100%" overflow="auto">
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
					<Th px={1.5} w={"200px"}>
						Team
					</Th>
					<Th px={1.5} w={"200px"}>
						Role
					</Th>
				</Tr>
			</Thead>
			<Tbody>
				{filteredEmployees.map(
					({ fullName, _id, email, baseModule, team, role }) => (
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
							<Td
								w={"100px"}
								whiteSpace={"pre-wrap"}
								py={1}
								px={1.5}
								fontSize={"xs"}
							>
								{team || ""}
							</Td>
							<Td
								w={"100px"}
								whiteSpace={"pre-wrap"}
								py={1}
								px={1.5}
								fontSize={"xs"}
							>
								{role}
							</Td>
						</Tr>
					),
				)}
			</Tbody>
		</Table>
	);
};

export default UserList;
