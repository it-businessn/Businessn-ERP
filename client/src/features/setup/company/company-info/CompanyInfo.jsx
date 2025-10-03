import { Box, Card, HStack, Icon, Stack, VStack } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import useSelectedCompanyInfo from "hooks/useSelectedCompanyInfo";
import { useState } from "react";
import { HiOfficeBuilding } from "react-icons/hi";
import { MdSettingsSuggest } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";
import { isNotEnrollerOrEmployee } from "utils";
import { getFormattedAddress } from "utils/common";
import EditCompanyInfo from "./EditCompanyInfo";

const CompanyInfo = ({ company, modules }) => {
	const loggedInUser = LocalStorageService.getItem("user");
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const companyInfo = useSelectedCompanyInfo(company, refresh);

	return (
		<Stack margin={"auto"} m="1em auto" w={"50%"}>
			{isNotEnrollerOrEmployee(loggedInUser?.role) && (
				<HStack justify={"end"}>
					<LeftIconButton
						color="var(--nav_color)"
						border="2px solid var(--filter_border_color)"
						name="Update CRA Number"
						borderRadius="10px"
						variant="ghost"
						isFilter
						size="md"
						handleClick={() => setShowEditDialog(true)}
						icon={<MdSettingsSuggest />}
					/>
					{/* <PrimaryButton name="View / Add Company" onOpen={() => setOpenCompanyForm(true)} /> */}
				</HStack>
			)}
			{showEditDialog && (
				<EditCompanyInfo
					setRefresh={setRefresh}
					isOpen={showEditDialog}
					companyInfo={companyInfo}
					onClose={() => setShowEditDialog(false)}
				/>
			)}
			{companyInfo && (
				<HStack
					flexDir={{ base: "column", md: "row" }}
					borderRadius="10px"
					border="3px solid var(--main_color)"
				>
					<Card
						flex={1}
						m="1em"
						bg={"var(--lead_cards_bg)"}
						border={"1px solid var(--lead_cards_bg)"}
					>
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
									<TextTitle title="Registration Number" width="280px" />
									<NormalTextTitle title={companyInfo.registration_number} />
								</HStack>
								<HStack>
									<TextTitle title="CRA Business Number" width="280px" />
									<NormalTextTitle title={companyInfo.cra_business_number} />
								</HStack>
								<HStack>
									<TextTitle title="Founding Year" width="280px" />
									<NormalTextTitle title={companyInfo.founding_year} />
								</HStack>
								<HStack>
									<TextTitle title="Industry Type" width="280px" />
									<NormalTextTitle title={companyInfo.industry_type} />
								</HStack>
								<HStack>
									<TextTitle title="Address" width="280px" />
									<NormalTextTitle
										whiteSpace={"wrap"}
										title={getFormattedAddress(companyInfo?.address)}
									/>
								</HStack>
							</Stack>
						</BoxCard>
						{/* <BoxCard>
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
				</BoxCard> */}
					</Card>
				</HStack>
			)}
		</Stack>
	);
};

export default CompanyInfo;
