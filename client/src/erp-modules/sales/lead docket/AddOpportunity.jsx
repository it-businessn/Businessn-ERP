import { HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import { useRef } from "react";
import { SiMicrosoftexcel } from "react-icons/si";

const AddOpportunity = () => {
	const fileInputRef = useRef(null);

	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				// try {
				// 	const workbook = XLSX.read(e.target.result, { type: "binary" });
				// 	const sheetName = workbook.SheetNames[0];
				// 	const excelData = XLSX.utils.sheet_to_json(
				// 		workbook.Sheets[sheetName],
				// 	);
				// 	const formattedData = excelData.map((row) => ({
				// 		...row,
				// 		selected: false,
				// 	}));
				// 	setData(formattedData);
				// 	// setData(excelData);
				// 	toast({
				// 		title: "File Uploaded",
				// 		description: "Excel sheet data has been loaded successfully.",
				// 		status: "success",
				// 		duration: 3000,
				// 		isClosable: true,
				// 	});
				// } catch (error) {
				// 	console.error("Error reading the Excel file:", error);
				// 	toast({
				// 		title: "Error",
				// 		description: "There was an error reading the Excel file.",
				// 		status: "error",
				// 		duration: 3000,
				// 		isClosable: true,
				// 	});
				// }
			};

			reader.readAsBinaryString(file);
		}
	};

	const handleIconButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<HStack justify={"flex-end"}>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileUpload}
				accept=".xlsx, .xls"
				style={{ display: "none" }}
			/>
			<PrimaryButton onOpen={onOpen} name={"Add new lead"} />
			<IconButton
				icon={<SiMicrosoftexcel />}
				bg="var(--primary_button_bg)"
				variant={"solid"}
				aria-label="Attach Excel file"
				onClick={handleIconButtonClick}
			/>
		</HStack>
	);
};

export default AddOpportunity;
