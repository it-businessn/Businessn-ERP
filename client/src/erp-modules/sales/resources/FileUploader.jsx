import { Box, Button, Flex, Input, Select, Text } from "@chakra-ui/react";
import { useState } from "react";
import ResourceService from "services/ResourceService";

const FileUploader = ({ fileTypes, userName, setNewUpload }) => {
	const [file, setFile] = useState(null);
	const [fileType, setFileType] = useState(fileTypes[0].type);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("fileType", fileType);
		formData.append("uploadedBy", userName);

		try {
			await ResourceService.upload(formData);
			setNewUpload((prev) => !prev);
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	};

	const handleFileTypeChange = (event) => {
		setFileType(event.target.value);
	};

	return (
		<Box flex={0.8}>
			<Text mt={2} mb={5} fontWeight="bold">
				Upload File
			</Text>
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="3px solid var(--main_color)"
				borderRadius="10px"
				fontWeight="bold"
			>
				<Input
					type="file"
					bg={"transparent"}
					onChange={handleFileChange}
					alignItems={"center"}
				/>
				<Select value={fileType} onChange={handleFileTypeChange} mt={2} mb={4}>
					{fileTypes.map(({ type }) => (
						<option value={type}>{type}</option>
					))}
				</Select>
				<Flex>
					{/* <Spacer /> */}
					<Button
						isDisabled={!file}
						bg="var(--primary_button_bg)"
						onClick={handleUpload}
						color={"brand.primary_bg"}
						variant={"solid"}
					>
						Upload
					</Button>
				</Flex>
			</Box>
		</Box>
	);
};

export default FileUploader;
