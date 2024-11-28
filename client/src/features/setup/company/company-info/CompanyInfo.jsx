import {
	Box,
	Card,
	HStack,
	Icon,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
} from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TextTitle from "components/ui/text/TextTitle";
import { HiOfficeBuilding } from "react-icons/hi";
import { getAddress } from "utils/common";

const CompanyInfo = ({ companyInfo, modules }) => {
	return (
		<HStack
			flexDir={{ base: "column", md: "row" }}
			borderRadius="10px"
			border="3px solid var(--main_color)"
			m="1em"
		>
			<Card flex={1} m="1em" bg={"var(--lead_cards_bg)"} border={"1px solid var(--lead_cards_bg)"}>
				<Box
					fontWeight="bold"
					p="1em"
					bg="var(--bg_color_1)"
					borderTopLeftRadius="10px"
					borderTopRightRadius="10px"
				>
					<VStack spacing={5}>
						<Icon as={HiOfficeBuilding} boxSize={10} />
						<TextTitle size="xl" title={companyInfo.name} />
					</VStack>
				</Box>
				<VStack align="flex-start" color={"var(--menu_item_color)"} p={"1em"}>
					<HStack>
						<TextTitle title="Registration Number" />
						<Text color={"var(--main_color_black)"}>{companyInfo.registration_number}</Text>
					</HStack>
					<HStack>
						<TextTitle title="Founding Year" />
						<Text color={"var(--main_color_black)"}>{companyInfo.founding_year}</Text>
					</HStack>

					<HStack>
						<TextTitle title="Industry Type" />
						<Text color={"var(--main_color_black)"}>{companyInfo.industry_type}</Text>
					</HStack>
					<HStack>
						<TextTitle title="Address" />
						<Text color={"var(--main_color_black)"}>{getAddress(companyInfo.address)}</Text>
					</HStack>
				</VStack>
				<Table variant="simple" size={"small"}>
					<Thead>
						<Tr>
							<Th px={"1em"}>Module Name</Th>
							<Th>Admin</Th>
						</Tr>
					</Thead>
					<Tbody>
						{(!modules || modules?.length === 0) && <EmptyRowRecord data={modules} colSpan={2} />}
						{modules?.map((module) => (
							<Tr key={module._id}>
								<Td w={"500px"} px={"1em"}>
									{module.name}
								</Td>
								<Td>{module.admin[0]}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Card>
		</HStack>
	);
};

export default CompanyInfo;
