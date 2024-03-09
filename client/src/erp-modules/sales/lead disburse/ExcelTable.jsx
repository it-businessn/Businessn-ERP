import {
	Box,
	Button,
	Checkbox,
	Icon,
	Select,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { generateLighterShade } from "utils";
import * as XLSX from "xlsx";

const LeadsDocket = () => {
	const [checkedRows, setCheckedRows] = useState([]);
	const handleCheckboxChange = (rowId) => {
		if (checkedRows.includes(rowId)) {
			setCheckedRows(checkedRows.filter((id) => id !== rowId));
		} else {
			setCheckedRows([...checkedRows, rowId]);
		}
	};
	const ele_bg = generateLighterShade("#537eee", 0.9);
	const ele_color = "#537eee";

	const [data, setData] = useState([]);
	const toast = useToast();

	const [selectedRows, setSelectedRows] = useState([]);
	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const workbook = XLSX.read(e.target.result, { type: "binary" });
					const sheetName = workbook.SheetNames[0];
					const excelData = XLSX.utils.sheet_to_json(
						workbook.Sheets[sheetName],
					);
					const formattedData = excelData.map((row) => ({
						...row,
						selected: false,
					}));

					setData(formattedData);
					// setData(excelData);
					toast({
						title: "File Uploaded",
						description: "Excel sheet data has been loaded successfully.",
						status: "success",
						duration: 3000,
						isClosable: true,
					});
				} catch (error) {
					console.error("Error reading the Excel file:", error);
					toast({
						title: "Error",
						description: "There was an error reading the Excel file.",
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
			};

			reader.readAsBinaryString(file);
		}
	};

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Lead Disbursement
			</Text>{" "}
			<input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
			<Button
				colorScheme="teal"
				size="sm"
				onClick={() => {
					setData([]);
					setSelectedRows([]);
				}}
			>
				Clear Table
			</Button>
			<Table variant="simple" mt={4}>
				<Thead>
					<Tr>
						<Th>
							<Checkbox />
						</Th>
						{data.length > 0 &&
							Object.keys(data[0]).map((header) => (
								<Th key={header}>{header}</Th>
							))}
					</Tr>
				</Thead>
				<Tbody>
					{data.map((row, rowIndex) => (
						<Tr key={rowIndex}>
							<Td>
								<Checkbox
									isChecked={selectedRows[rowIndex] || false}
									onChange={() => handleCheckboxChange(rowIndex)}
								/>
							</Td>
							{Object.values(row).map((cell, cellIndex) => {
								if (cellIndex === 2)
									return (
										<Select
											icon={<Icon as={FaCaretDown} />}
											borderRadius={"10px"}
											size={"sm"}
											color={ele_color}
											bg={ele_bg}
											border={`1px solid ${ele_color}`}
										>
											{["Abc"].map(({ name }) => (
												<option value={cell} key={name}>
													{cell}
												</option>
											))}
										</Select>
									);
								else return <Td key={cellIndex}>{cell}</Td>;
							})}
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default LeadsDocket;
