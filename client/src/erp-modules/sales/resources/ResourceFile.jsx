import {
	Box,
	Button,
	Card,
	Flex,
	HStack,
	Icon,
	Image,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
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
	return (
		<>
			<Flex justifyContent={"space-between"}>
				<VStack alignItems={"self-start"}>
					<Text mt={2} mb={5} fontWeight="bold">
						Browse by subject
					</Text>
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
			<SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing="1em" my="5">
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
							<HStack w={"100%"}>
								<Button
									onClick={() => handleDownload(resource.originalname)}
									w={"100%"}
									bg="var(--primary_button_bg)"
									color={"brand.primary_bg"}
									variant={"solid"}
									_hover={{ color: "brand.600" }}
									borderRadius={"10px"}
									size="xs"
									rightIcon={<GoDownload />}
								>
									Download
								</Button>
								<Button
									onClick={() => handleDelete(resource._id)}
									w={"100%"}
									bg="var(--primary_button_bg)"
									color={"brand.primary_bg"}
									variant={"solid"}
									_hover={{ color: "brand.600" }}
									borderRadius={"10px"}
									size="xs"
									rightIcon={<MdDeleteOutline />}
								>
									Delete
								</Button>
							</HStack>
						</VStack>
					</Box>
				))}
			</SimpleGrid>
		</>
	);
};

export default ResourceFile;
