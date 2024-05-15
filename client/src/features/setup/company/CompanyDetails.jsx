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
import Loader from "components/Loader";
import { useEffect, useState } from "react";
import { HiOfficeBuilding } from "react-icons/hi";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import { toCapitalize } from "utils";

const CompanyDetails = () => {
	const [companyInfo, setCompanyInfo] = useState(null);
	const [modules, setModules] = useState(null);
	const company =
		LocalStorageService.getItem("selectedCompany") || "BusinessN Corporate";

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
				const response = await SettingService.getAllModules();
				setModules(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllModules();
		fetchCompanyInfo();
	}, []);

	const getAddress = (address) =>
		address
			? toCapitalize(
					`${address.streetNumber} ${address.city} ${address.state} ${address.country} ${address.postalCode}`,
			  )
			: "";

	return (
		companyInfo && (
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
							<Text fontSize="xl" fontWeight="bold">
								{companyInfo.name}
							</Text>
						</VStack>
					</Box>
					<VStack align="flex-start" color={"brand.200"} p={"1em"}>
						<HStack>
							<Text fontWeight="bold">Registration Number</Text>
							<Text color={"brand.600"}>{companyInfo.registration_number}</Text>
						</HStack>
						<HStack>
							<Text fontWeight="bold">Founding Year</Text>
							<Text color={"brand.600"}>{companyInfo.founding_year}</Text>
						</HStack>

						<HStack>
							<Text fontWeight="bold">Industry Type</Text>
							<Text color={"brand.600"}>{companyInfo.industry_type}</Text>
						</HStack>
						<HStack>
							<Text fontWeight="bold">Address</Text>
							<Text color={"brand.600"}>{getAddress(companyInfo.address)}</Text>
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
		)
	);
};

export default CompanyDetails;
