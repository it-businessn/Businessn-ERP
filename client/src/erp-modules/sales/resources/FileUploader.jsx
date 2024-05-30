import { Box, Flex, Input, Select } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
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
			<TextTitle mt={2} mb={5} title="Upload File" />
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="3px solid var(--main_color)"
				borderRadius="10px"
				fontWeight="bold"
			>
				<Input
					type="file"
					border={"none"}
					bg={"transparent"}
					onChange={handleFileChange}
					alignItems={"center"}
				/>
				<Select value={fileType} onChange={handleFileTypeChange} mt={2} mb={4}>
					{fileTypes
						.filter(({ type }) => type !== "Training")
						.map(({ type }) => (
							<option value={type}>{type}</option>
						))}
				</Select>
				<Flex>
					{/* <Spacer /> */}
					<PrimaryButton
						name="Upload"
						isDisabled={!file}
						onOpen={handleUpload}
					/>
				</Flex>
			</Box>
		</Box>
	);
};

export default FileUploader;
