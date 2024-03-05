import {
	Box,
	Checkbox,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as api from "services";
import { useBreakpointValue } from "services/Breakpoint";

const LeadsDocket = () => {
	const { isMobile } = useBreakpointValue();
	const [contacts, setContacts] = useState(null);
	const fetchAllContacts = async () => {
		try {
			const response = await api.getContacts();
			response.data.map((item) => (item.comm = "Meeting"));
			setContacts(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllContacts();
	}, []);
	const data = [
		{ id: 1, name: "Item 1", category: "Category A" },
		{ id: 2, name: "Item 2", category: "Category B" },
		{ id: 3, name: "Item 3", category: "Category A" },
		// Add more data as needed
	];
	const columns = ["id", "name", "category"];
	const [selectedColumns, setSelectedColumns] = useState(columns);

	const handleColumnSelect = (column) => {
		if (selectedColumns.includes(column)) {
			setSelectedColumns(selectedColumns.filter((col) => col !== column));
		} else {
			setSelectedColumns([...selectedColumns, column]);
		}
	};
	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Lead Docket
			</Text>
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>
							<Checkbox />
						</Th>
						{columns.map((column) => (
							<Th key={column}>
								<Menu>
									<MenuButton as={Text} cursor="pointer">
										{column}
									</MenuButton>
									<MenuList>
										<MenuItem onClick={() => handleColumnSelect(column)}>
											{selectedColumns.includes(column) ? "Hide" : "Show"}
										</MenuItem>
									</MenuList>
								</Menu>
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{data.map((item) => (
						<Tr key={item.id}>
							<Td>
								<Checkbox />
							</Td>
							{selectedColumns.map((column) => (
								<Td key={column}>{item[column]}</Td>
							))}
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default LeadsDocket;
