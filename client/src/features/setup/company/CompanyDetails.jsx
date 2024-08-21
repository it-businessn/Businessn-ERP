import {
	Box,
	Card,
	Flex,
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
import Loader from "components/Loader";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";

import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { useEffect, useState } from "react";
import { HiOfficeBuilding } from "react-icons/hi";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import { isManager, toCapitalize } from "utils";
import CompaniesPanel from "./CompaniesPanel";

const CompanyDetails = ({ company }) => {
	const loggedInUser = LocalStorageService.getItem("user");
	const [openCompanyForm, setOpenCompanyForm] = useState(false);
	const [companyInfo, setCompanyInfo] = useState(null);
	const [modules, setModules] = useState(null);

	useEffect(() => {
		const fetchCompanyInfo = async () => {
			try {
				const response = await SettingService.getCompanyInfo(company);
				setCompanyInfo(response.data[0]);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllModules = async () => {
			try {
				const response = await SettingService.getAllModules(company);
				setModules(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllModules();
		fetchCompanyInfo();
	}, [company]);

	const getAddress = (address) =>
		address
			? toCapitalize(
					`${address.streetNumber} ${address.city} ${address.state} ${address.country} ${address.postalCode}`,
			  )
			: "";

	return (
		<>
			{isManager(loggedInUser?.role) && (
				<Flex justify={"end"}>
					<PrimaryButton
						name={"Add new company"}
						onOpen={() => setOpenCompanyForm(true)}
					/>
				</Flex>
			)}
			{openCompanyForm && (
				<CompaniesPanel setOpenCompanyForm={setOpenCompanyForm} />
			)}

			{!openCompanyForm && companyInfo && (
				<HStack
					flexDir={{ base: "column", md: "row" }}
					borderRadius="10px"
					border="3px solid var(--main_color)"
					m="1em"
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
								<TextTitle size="xl" title={companyInfo.name} />
							</VStack>
						</Box>
						<VStack
							align="flex-start"
							color={"var(--menu_item_color)"}
							p={"1em"}
						>
							<HStack>
								<TextTitle title="Registration Number" />
								<Text color={"var(--main_color_black)"}>
									{companyInfo.registration_number}
								</Text>
							</HStack>
							<HStack>
								<TextTitle title="Founding Year" />
								<Text color={"var(--main_color_black)"}>
									{companyInfo.founding_year}
								</Text>
							</HStack>

							<HStack>
								<TextTitle title="Industry Type" />
								<Text color={"var(--main_color_black)"}>
									{companyInfo.industry_type}
								</Text>
							</HStack>
							<HStack>
								<TextTitle title="Address" />
								<Text color={"var(--main_color_black)"}>
									{getAddress(companyInfo.address)}
								</Text>
							</HStack>
						</VStack>
						{!modules && <Loader autoHeight />}
						{modules && (
							<Table variant="simple" size={"small"}>
								<Thead>
									<Tr>
										<Th px={"1em"}>Module Name</Th>
										<Th>Admin</Th>
									</Tr>
								</Thead>
								<Tbody>
									{!modules?.length && <EmptyRowRecord />}
									{modules.map((module) => (
										<Tr key={module._id}>
											<Td w={"500px"} px={"1em"}>
												{module.name}
											</Td>
											<Td>{module.admin[0]}</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						)}
					</Card>
				</HStack>
			)}
		</>
	);
};

export default CompanyDetails;
