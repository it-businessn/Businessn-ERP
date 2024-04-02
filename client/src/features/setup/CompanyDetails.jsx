import { Box, Card, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HiOfficeBuilding } from "react-icons/hi";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import { toCapitalize } from "utils";

const CompanyDetails = () => {
	const [companyInfo, setCompanyInfo] = useState(null);
	const [departments, setDepartments] = useState(null);
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
		const fetchAllDepartments = async () => {
			try {
				const response = await SettingService.getAllDepartments();
				setDepartments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllDepartments();
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
					{departments?.map((department) => (
						<VStack alignItems={"self-start"} p={"1em"} key={department._id}>
							<Text fontWeight="bolder"> Base Modules</Text>
							<HStack>
								<Text fontWeight="bold">Module Name:</Text>
								<Text color={"brand.600"}>{department.name}</Text>
								<HStack pl={3}>
									<Text fontWeight="bold">Admin:</Text>
									<Text fontWeight="bold" color={"brand.600"}>
										{department.admin[0]}
									</Text>
								</HStack>
								{/* <HStack pl={3}>
									<Text fontWeight="bold">Is Active:</Text>
									<Text fontWeight="bold" color={"brand.600"}>
										{department.admin[0]}
									</Text>
								</HStack> */}
							</HStack>
						</VStack>
					))}
				</Card>
			</HStack>
		)
	);
};

export default CompanyDetails;
