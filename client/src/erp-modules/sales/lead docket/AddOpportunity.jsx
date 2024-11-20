import { HStack, IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import { useRef } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import AddNewOpportunity from "../opportunities/AddNewOpportunity";

const AddOpportunity = ({ data, setData, company, companies, setRefresh }) => {
	const fileInputRef = useRef(null);

	const toast = useToast();
	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			function parseAddress(addressString) {
				const parts = addressString.split(" ");

				return {
					streetNumber: "",
					city: parts[0] || "",
					state: parts[1] || "",
					postalCode: "",
					country: parts.slice(2).join(" ") || "",
				};
			}

			reader.onload = (e) => {
				try {
					const workbook = XLSX.read(e.target.result, { type: "binary" });
					const sheetName = workbook.SheetNames[0];
					const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
					const formattedData = excelData.map((row) => ({
						...row,
						selected: false,
					}));

					formattedData.map((lead) => {
						lead.abbreviation = lead.firstName;
						lead.address = parseAddress(lead.location);
						lead.phone = lead.phoneNumbers;
						lead.opportunityName = `${lead.firstName} ${lead.lastName}`;
						return lead;
					});

					setData(formattedData);
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
			<PrimaryButton onOpen={onOpen} name={"Add new lead"} size={"xs"} />
			<IconButton
				size={"xs"}
				icon={<SiMicrosoftexcel />}
				bg="var(--primary_button_bg)"
				variant={"solid"}
				aria-label="Attach Excel file"
				onClick={handleIconButtonClick}
			/>
			{isOpen && (
				<AddNewOpportunity
					// setIsAdded={setIsAdded}
					isDocket
					isOpen={isOpen}
					onClose={onClose}
					company={company}
					companies={companies}
					setRefresh={setRefresh}
				/>
			)}
		</HStack>
	);
};

export default AddOpportunity;
