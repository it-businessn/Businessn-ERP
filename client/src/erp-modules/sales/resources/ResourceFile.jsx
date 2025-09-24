import { Box, Button, Flex, Icon, Input, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { useData } from "context/DataContext";
import { useEffect, useState } from "react";
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
	fullName,
	isUserManager,
	company,
	selectedFilter,
	setSelectedFilter,
}) => {
	const { isMobile, isIpad } = useBreakpointValue();

	const [resources, setResources] = useState(null);
	// const [editResource, setEditResource] = useState(false);
	const [newUpload, setNewUpload] = useState(null);
	const [isEditable, setIsEditable] = useState(false);
	const [resourceId, setResourceId] = useState(null);
	const [fileName, setFileName] = useState("");
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const [selectedFileType, setSelectedFileType] = useState(selectedFilter);

	useEffect(() => {
		const fetchResourceByType = async () => {
			try {
				const { data } = await ResourceService.getResourcesByType({
					type: selectedFilter,
					company,
				});

				data?.map(
					(resource) =>
						(resource.title = `${
							resource.originalname.trim().replace(".pdf", "").split("(")[0]
						} \n${resource.fileType}`),
				);
				setResources(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedFilter) {
			fetchResourceByType();
		}
	}, [selectedFilter, newUpload, company]);

	useEffect(() => {
		const fetchAllResources = async () => {
			try {
				const { data } = await ResourceService.getResourcesByCompany(company);
				setResources(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (!selectedFilter) {
			fetchAllResources();
		}
	}, [selectedFilter, company]);

	const handleFilterClick = (filter) => {
		setSelectedFilter(filter);
		const fileType = fileTypes.find((r) => r.type == filter)?.type;
		setSelectedFileType(fileType);
	};

	const handleDownload = (fileName) => {
		const url = BASE_URL;
		const downloadUrl = `${url}/resource/download/${fileName}`;
		window.location.href = downloadUrl;
	};

	const handleDelete = async () => {
		try {
			await ResourceService.deleteResource({}, deleteRecord);
			setNewUpload((prev) => !prev);
			setShowConfirmationPopUp((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};
	const handleClose = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};

	const getBgColor = () => COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)];

	const saveInput = async () => {
		if (fileName !== "") {
			try {
				await ResourceService.updateResource({ fileName }, resourceId);
				setIsEditable(false);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleEdit = (resource) => {
		if (isEditable && resourceId === resource._id) {
			saveInput();
			return;
		}
		setIsEditable(true);
		setFileName(resource.originalname);
		setResourceId(resource._id);
	};

	const { permissionData } = useData();
	const hasDeleteAccess =
		isUserManager &&
		permissionData
			.find((record) => record.id === "sales")
			?.children?.find((item) => item.path === "resources").permissions?.canDeleteModule;

	const hasEditAccess = permissionData
		.find((record) => record.id === "sales")
		?.children?.find((item) => item.path === "resources").permissions?.canEditModule;

	return (
		<>
			<Flex justifyContent={"space-between"}>
				<VStack alignItems={"self-start"}>
					{/* <TextTitle mt={2} mb={5} title="Browse by subject" /> */}
					{isMobile || isIpad ? (
						<SimpleGrid columns={{ base: 2, md: 3 }} spacing="1em" my="5">
							{fileTypes?.map(({ type }) => (
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
							company={company}
							selectedFileType={selectedFileType}
						/>
					)}
					<SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing="1em" my="5">
						{resources?.map((resource) => (
							<Box
								key={resource._id}
								p="1em"
								bg={"var(--primary_bg)"}
								border="3px solid var(--main_color)"
								borderRadius="10px"
							>
								<VStack spacing={"1em"}>
									<Box
										maxW="md"
										borderRadius="0"
										overflow="hidden"
										p={4}
										h={"120px"}
										// color={"var(--primary_bg)"}
										bg={getBgColor()}
									>
										<TextTitle
											p={"0 1em"}
											size={"xl"}
											weight="normal"
											whiteSpace="pre-wrap"
											title={resource.title}
										/>
									</Box>

									{isEditable && resourceId === resource._id ? (
										<Input
											type={"text"}
											size={"xs"}
											m={0}
											value={fileName}
											onChange={(e) => {
												setFileName(e.target.value);
											}}
										/>
									) : (
										<NormalTextTitle
											title={resourceId === resource._id ? fileName : resource.originalname}
											size={"sm"}
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
												onOpen={() => {
													setShowConfirmationPopUp(true);
													setDeleteRecord(resource._id);
												}}
											/>
										)}
										{/* {isUserManager && (
											<PrimaryButton
												minW={"95%"}
												size={"xs"}
												px={"5px"}
												name={
													isEditable && resourceId === resource._id
														? "Save"
														: "Edit"
												}
												rightIcon={<BiPencil />}
												onOpen={() => handleEdit(resource)}
											/>
										)} */}
									</VStack>
								</VStack>
							</Box>
						))}
					</SimpleGrid>
				</>
			)}
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete Resource"}
					textTitle={"Are you sure you want to delete the file?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</>
	);
};

export default ResourceFile;
