import { Box, HStack, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useCrews from "hooks/useCrews";
import { useState } from "react";
import { HiPencil } from "react-icons/hi";
import EditCrew from "./EditCrew";

const CrewList = ({ company, refresh, setRefresh, employees, costCenters, departments }) => {
	const TABLE_COL_COLOR = {
		hoverBg: useColorModeValue("gray.50", "gray.700"),
		borderColor: useColorModeValue("gray.200", "gray.600"),
		nameBoxBg: useColorModeValue("blue.50", "blue.900"),
		nameColor: useColorModeValue("blue.600", "blue.200"),
	};
	const { crews, setCrews } = useCrews(company, refresh);
	const [editRecord, setEditRecord] = useState(null);

	// const handleEdit = () => {
	// 	setCrews((prev) => prev.map((record) => (record._id === editRecord._id ? editRecord : record)));
	// 	handleClose();
	// };

	const handleClose = () => setEditRecord(null);

	return (
		<Box overflow="auto" css={tabScrollCss}>
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
						<EmptyRowRecord
							data={crews}
							colSpan={3}
							title="No crews found"
							description="Add crew to see them listed here"
						/>
					)}
					{crews?.map((crew) => {
						return (
							<Tr
								key={crew._id}
								_hover={{ bg: TABLE_COL_COLOR.hoverBg }}
								transition="all 0.2s"
								cursor="pointer"
							>
								<Td py={1} borderBottomColor={TABLE_COL_COLOR.borderColor}>
									<NormalTextTitle size="sm" title={crew.name} />
								</Td>
								<Td py={0} borderBottomColor={TABLE_COL_COLOR.borderColor}>
									<NormalTextTitle size="sm" title={crew.createdBy} />
								</Td>
								<Td py={0} borderBottomColor={TABLE_COL_COLOR.borderColor}>
									<HStack spacing={2}>
										<LeftIconButton
											name="Edit Configuration"
											size="xs"
											icon={<HiPencil color="#4e2847" />}
											handleClick={() => setEditRecord(crew)}
											color="#4e2847"
											_hover={{
												bg: "transparent",
												transform: "scale(1.02)",
												transition: "all 0.2s ease-in-out",
											}}
											px={4}
											variant="ghost"
											bg="transparent"
										/>
									</HStack>
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
			{editRecord && (
				<EditCrew
					employees={employees}
					company={company}
					crew={editRecord}
					isOpen={editRecord}
					onClose={handleClose}
					costCenters={costCenters}
					departments={departments}
					setRefresh={setRefresh}
				/>
			)}
		</Box>
	);
};
export default CrewList;
