import { Box, Button, Flex, Icon, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useData } from "context/DataContext";
import { useEffect, useState } from "react";
import { BiPencil } from "react-icons/bi";
import { FaDownload } from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { BASE_URL } from "services";
import { useBreakpointValue } from "services/Breakpoint";
import ResourceService from "services/ResourceService";
import { COVER_COLORS } from "utils";
import FileUploader from "./FileUploader";

const ResourceFile = ({
	fileTypes,
	selectedFilter,
	setSelectedFilter,
	resources,
	setNewUpload,
	fullName,
	isUserManager,
}) => {
	const [isEditable, setIsEditable] = useState(false);
	const [resourceId, setResourceId] = useState(null);
	const [fileName, setFileName] = useState("");
	const { isMobile, isIpad } = useBreakpointValue();
	const handleFilterClick = (filter) => {
		setSelectedFilter(filter);
	};
	const handleDownload = (fileName) => {
		const url = BASE_URL;
		const downloadUrl = `${url}/companyResource/download/${fileName}`;
		window.location.href = downloadUrl;
	};
	const handleDelete = async (id) => {
		try {
			await ResourceService.deleteResource({}, id);
			setNewUpload((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};
	const saveInput = async () => {
		if (fileName !== "") {
			try {
				await ResourceService.updateResource({ fileName }, resourceId);
				setIsEditable(false);
				// setNewUpload((prev) => !prev);
			} catch (error) {
				console.error(error);
			}
		}
	};

	useEffect(() => {
		const typingTimer = setTimeout(() => {
			saveInput();
		}, 2500);

		return () => clearTimeout(typingTimer);
	}, [fileName]);

	const handleEdit = (resource) => {
		setIsEditable(true);
		setFileName(resource.originalname);
		setResourceId(resource._id);
	};

	const { permissionData } = useData();
	const hasDeleteAccess = permissionData
		.find((record) => record.id === "sales")
		?.children?.find((item) => item.path === "resources")
		.permissions?.canDeleteModule;

	const hasEditAccess = permissionData
		.find((record) => record.id === "sales")
		?.children?.find((item) => item.path === "resources")
		.permissions?.canEditModule;

	return (
		<>
			<Flex justifyContent={"space-between"}>
				<VStack alignItems={"self-start"}>
					{/* <TextTitle mt={2} mb={5} title="Browse by subject" /> */}
					{isMobile || isIpad ? (
						<SimpleGrid columns={{ base: 2, md: 3 }} spacing="1em" my="5">
							{fileTypes.map(({ type }) => (
								<Button
									key={type}
									borderRadius={"50px"}
									p={"1em"}
									color={selectedFilter === type ? "#4c67c3" : "#676e78"}
									onClick={() => handleFilterClick(type)}
									variant={"outline"}
									leftIcon={<Icon as={FaDownload} />}
									size="xs"
								>
									{type}
								</Button>
							))}
						</SimpleGrid>
					) : (
						<Flex gap="1em">
							{fileTypes.map(({ type }) => (
								<Button
									key={type}
									borderRadius={"50px"}
									p={"1em"}
									color={selectedFilter === type ? "#4c67c3" : "#676e78"}
									onClick={() => handleFilterClick(type)}
									variant={"outline"}
									leftIcon={<Icon as={FaDownload} />}
									size="xs"
								>
									{type}
								</Button>
							))}
						</Flex>
					)}
				</VStack>
			</Flex>
			{selectedFilter !== "Training" && (
				<>
					{isUserManager && (
						<FileUploader
							setNewUpload={setNewUpload}
							fileTypes={fileTypes}
							userName={fullName}
						/>
					)}
					<SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing="1em" my="5">
						{resources?.map((resource) => (
							<Box
								key={resource._id}
								p="1em"
								bg={"brand.primary_bg"}
								border="3px solid var(--main_color)"
								borderRadius="10px"
							>
								<VStack spacing={"1em"}>
									<Box
										maxW="md"
										borderRadius="0"
										overflow="hidden"
										p={4}
										// color={"var(--primary_bg)"}
										bg={
											COVER_COLORS[
												Math.floor(Math.random() * COVER_COLORS.length)
											]
										}
									>
										<TextTitle
											p={"0 1em"}
											size={"xl"}
											weight="normal"
											whiteSpace="pre-wrap"
											title={`${
												resource.originalname
													.trim()
													.replace(".pdf", "")
													.split("(")[0]
											} \n${resource.fileType}`}
										/>
									</Box>
									{!isEditable && (
										<TextTitle
											title={resource.originalname}
											weight="normal"
											size={"sm"}
										/>
									)}
									{isEditable && (
										<InputFormControl
											label={"File Name"}
											name="name"
											valueText={fileName}
											handleChange={(e) => {
												setFileName(e.target.value);
											}}
											required
										/>
									)}
									<VStack w={"100%"}>
										<PrimaryButton
											minW={"95%"}
											size={"xs"}
											px={"5px"}
											name={"Download"}
											rightIcon={<GoDownload />}
											onOpen={() => handleDownload(resource.originalname)}
										/>
										{hasDeleteAccess && (
											<PrimaryButton
												minW={"95%"}
												size={"xs"}
												px={"5px"}
												name={"Delete"}
												rightIcon={<MdDeleteOutline />}
												onOpen={() => handleDelete(resource._id)}
											/>
										)}
										{hasEditAccess && (
											<PrimaryButton
												minW={"95%"}
												size={"xs"}
												px={"5px"}
												name={"Edit"}
												rightIcon={<BiPencil />}
												onOpen={() => handleEdit(resource)}
											/>
										)}
									</VStack>
								</VStack>
							</Box>
						))}
					</SimpleGrid>
				</>
			)}
		</>
	);
};

export default ResourceFile;
