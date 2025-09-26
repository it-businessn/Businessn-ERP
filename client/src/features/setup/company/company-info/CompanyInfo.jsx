import {
	Box,
	Card,
	HStack,
	Icon,
	Stack,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	VStack,
} from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { HiOfficeBuilding } from "react-icons/hi";
import { getFormattedAddress } from "utils/common";

const CompanyInfo = ({ companyInfo, modules }) => {
	return (
		<HStack
			flexDir={{ base: "column", md: "row" }}
			borderRadius="10px"
			border="3px solid var(--main_color)"
			m="1em auto"
			w={"60%"}
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
						<TextTitle align={"center"} size="xl" title={companyInfo.name} />
					</VStack>
				</Box>
				<BoxCard>
					<Stack>
						<HStack>
							<TextTitle title="Registration Number" width="200px" />
							<NormalTextTitle title={companyInfo.registration_number} />
						</HStack>
						<HStack>
							<TextTitle title="Founding Year" width="200px" />
							<NormalTextTitle title={companyInfo.founding_year} />
						</HStack>
						<HStack>
							<TextTitle title="Industry Type" width="200px" />
							<NormalTextTitle title={companyInfo.industry_type} />
						</HStack>
						<HStack>
							<TextTitle title="Address" width="200px" />
							<NormalTextTitle
								whiteSpace={"wrap"}
								title={getFormattedAddress(companyInfo?.address)}
							/>
						</HStack>
					</Stack>
				</BoxCard>
				<BoxCard>
					<Table size={"small"}>
						<Thead>
							<Tr>
								<Th fontWeight={"bold"} px={"1em"}>
									Module Name
								</Th>
								<Th fontWeight={"bold"}>Admin</Th>
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
				</BoxCard>
			</Card>
		</HStack>
	);
};

export default CompanyInfo;
