import {
	Box,
	Button,
	Card,
	Flex,
	Icon,
	Image,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useData } from "context/DataContext";
import { BiPencil } from "react-icons/bi";
import { FaDownload } from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { BASE_URL } from "services";
import { useBreakpointValue } from "services/Breakpoint";
import ResourceService from "services/ResourceService";
import bookCover from "../../../assets/logos/BusinessN_all.jpg";

const ResourceFile = ({
	fileTypes,
	selectedFilter,
	setSelectedFilter,
	resources,
	setNewUpload,
}) => {
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
	const handleEdit = async (id) => {
		try {
			// await ResourceService.updateCover("data", id);
			// setNewUpload((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};
	const { permissionData } = useData();
	const hasDeleteAccess = permissionData
		.find((record) => record.id === "sales")
		?.children?.find((item) => item.path === "resources")
		.permissions?.canDeleteModule;

	return (
		<>
			<Flex justifyContent={"space-between"}>
				<VStack alignItems={"self-start"}>
					<TextTitle mt={2} mb={5} title="Browse by subject" />
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
			<SimpleGrid
				columns={{ base: 1, md: 2, lg: 4, xl: 6 }}
				spacing="1em"
				my="5"
			>
				{resources?.map((resource) => (
					<Box
						key={resource._id}
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
					>
						<VStack spacing={"1em"}>
							<Card maxW="md" borderRadius="0" overflow="hidden">
								<Image src={bookCover} alt={"book.title"} />
							</Card>
							<Text fontSize={"sm"}>{resource.originalname}</Text>
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
									<>
										<PrimaryButton
											minW={"95%"}
											size={"xs"}
											px={"5px"}
											name={"Delete"}
											rightIcon={<MdDeleteOutline />}
											onOpen={() => handleDelete(resource._id)}
										/>
										<PrimaryButton
											minW={"95%"}
											size={"xs"}
											px={"5px"}
											name={"Edit"}
											rightIcon={<BiPencil />}
											onOpen={() => handleEdit(resource._id)}
										/>
									</>
								)}
							</VStack>
						</VStack>
					</Box>
				))}
			</SimpleGrid>
		</>
	);
};

export default ResourceFile;
