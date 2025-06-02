import {
	Box,
	Flex,
	HStack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
} from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import useCrews from "hooks/useCrews";
import { HiPencil } from "react-icons/hi";

const CrewList = ({ company, refresh }) => {
	const TABLE_COL_COLOR = {
		hoverBg: useColorModeValue("gray.50", "gray.700"),
		borderColor: useColorModeValue("gray.200", "gray.600"),
		nameBoxBg: useColorModeValue("blue.50", "blue.900"),
		nameColor: useColorModeValue("blue.600", "blue.200"),
	};
	const { crews } = useCrews(company, refresh);

	return (
		<Box overflow="auto">
			<Table>
				<Thead position="sticky" top={-1} zIndex={1}>
					<Tr>
						{["Name", "Created By", ""]?.map((col, index) => (
							<Th key={`${col}_${index}`}>
								<TextTitle title={col} />
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{(!crews || crews?.length === 0) && (
						<Tr>
							<Td colSpan={2}>
								<Flex direction="column" align="center" justify="center" py={10} color="gray.500">
									<Box fontSize="xl" mb={2}>
										No crews found
									</Box>
									<Text fontSize="sm">Add crew to see them listed here</Text>
								</Flex>
							</Td>
						</Tr>
					)}
					{crews?.map(({ _id, createdBy, name }) => {
						return (
							<Tr
								key={_id}
								_hover={{ bg: TABLE_COL_COLOR.hoverBg }}
								transition="all 0.2s"
								cursor="pointer"
							>
								<Td py={1} borderBottomColor={TABLE_COL_COLOR.borderColor}>
									<NormalTextTitle size="sm" title={name} />
								</Td>
								<Td py={0} borderBottomColor={TABLE_COL_COLOR.borderColor}>
									<NormalTextTitle size="sm" title={createdBy} />
								</Td>
								<Td py={0} borderBottomColor={TABLE_COL_COLOR.borderColor}>
									<HStack spacing={2}>
										<LeftIconButton
											name="Edit Configuration"
											size="xs"
											icon={<HiPencil color="#4e2847" />}
											// handleClick={() => setShowAdd(true)}
											color="#4e2847"
											_hover={{
												bg: "transparent",
												transform: "scale(1.02)",
												transition: "all 0.2s ease-in-out",
											}}
											px={4}
											variant="ghost"
											bg={"#fff"}
										/>
									</HStack>
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</Box>
	);
};
export default CrewList;
