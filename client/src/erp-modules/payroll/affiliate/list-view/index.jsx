import {
	Box,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	SimpleGrid,
	useDisclosure,
} from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import SendEmailList from "erp-modules/payroll/employees/listview/SendEmailList";
import NewEmployeeOnboardingModal from "erp-modules/payroll/onboard-user/NewEmployeeOnboardingModal";
import PayrollActions from "erp-modules/payroll/workview/paygroup-header-table/PayrollActions";
import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { AiOutlineFileDone, AiOutlineSend } from "react-icons/ai";
import { FaFileInvoiceDollar, FaPlus, FaSearch } from "react-icons/fa";
import { RiUserUnfollowLine } from "react-icons/ri";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import Affiliates from "./Affiliates";

const PAYGROUP_ACTIONS = [
	{ key: "form", name: "Issue Forms", icon: AiOutlineFileDone },
	{ key: "terminate", name: "Terminate", icon: RiUserUnfollowLine },
	{ key: "send-login", name: "Send Login", icon: AiOutlineSend },
	{ key: "send-paystub", name: "Send Paystub", icon: FaFileInvoiceDollar },
];

const AffiliateListView = () => {
	const loggedInUser = LocalStorageService.getItem("user");
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const { isOpen: showOnboard, onOpen: openOnboard, onClose: closeOnboard } = useDisclosure();

	const { hasMultiPaygroups, selectedPayGroupOption, setSelectedPayGroupOption, payGroups } =
		usePaygroup(company, false);

	const [affiliates, setAffiliates] = useState(null);
	const [filteredAffiliates, setFilteredAffiliates] = useState(null);

	const [empName, setEmpName] = useState("");
	const [selectEmpList, setSelectEmpList] = useState(false);
	const [emailType, setEmailType] = useState(null);

	useEffect(() => {
		const fetchAllAffiliates = async () => {
			try {
				const { data } = await PayrollService.getAllAffiliateMembers(company);
				setAffiliates(data);
				setFilteredAffiliates(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAffiliates();
	}, [company]);

	const handleClick = (val) => {};

	const handleInputChange = (value) => {
		setEmpName(value);
		const selectedEmp = affiliates?.filter((emp) =>
			emp?.empId?.fullName?.toLowerCase().includes(value.toLowerCase()),
		);
		setFilteredAffiliates(selectedEmp);
	};

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroupOption(value);
		}
	};

	return (
		<PageLayout
			width={"35%"}
			title={"Affiliates"}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
			handleChange={handleChange}
			hasMultiPaygroups={hasMultiPaygroups}
			showPayGroup={true}
			selectedValue={selectedPayGroupOption}
			data={payGroups}
		>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<Flex direction="column" gap={6}>
					{/* Search Section */}
					<InputGroup
						maxW="300px"
						borderRadius={"10px"}
						border={"1px solid var(--filter_border_color)"}
						fontSize="xs"
						fontWeight="bold"
						size="sm"
					>
						<Input
							_placeholder={{
								color: "var(--nav_color)",
								fontSize: "sm",
							}}
							name="empName"
							value={empName}
							onChange={(e) => handleInputChange(e.target.value)}
							color={"var(--nav_color)"}
							bg={"var(--primary_bg)"}
							type="text"
							placeholder="Search employee"
							pr="4.5rem"
						/>
						<InputRightElement children={<FaSearch />} />
					</InputGroup>
				</Flex>

				{/* Actions Section */}
				<PayrollActions handleClick={handleClick} actions={PAYGROUP_ACTIONS} />
			</SimpleGrid>
			<Box>
				<Flex mb={1} gap={6} align="center">
					<LeftIconButton
						name="Add Affiliate"
						size="sm"
						icon={<FaPlus color="#fff" fontSize="14px" />}
						handleClick={openOnboard}
						bg="#381c34"
						color="white"
						_hover={{
							bg: "#4e2847",
							transform: "scale(1.02)",
							transition: "all 0.2s ease-in-out",
						}}
						px={4}
					/>
					<HStack spacing={6} divider={<Box w="1px" h="20px" bg="gray.200" />}>
						{/* <HStack spacing={4}>
							<RadioFormControl
								size="sm"
								handleChange={(value) => {
									setPayrollStatus(value);
								}}
								defaultVal="Active"
								options={[
									{ name: "Active Affiliates", value: "Active" },
									{ name: "Inactive Affiliates", value: "Inactive" },
									{ name: "Terminated Affiliates", value: "Terminated" },
									{ name: "All", value: "All" },
								]}
							/>
						</HStack> */}
					</HStack>
				</Flex>
				<Affiliates affiliates={filteredAffiliates} />
			</Box>
			{/* New Onboarding Modal */}
			{showOnboard && (
				<NewEmployeeOnboardingModal
					isAffiliate
					title="Affiliate"
					isOpen={showOnboard}
					onClose={closeOnboard}
				/>
			)}
			{selectEmpList && (
				<SendEmailList
					title={""}
					isOpen={selectEmpList}
					onClose={() => setSelectEmpList(false)}
					employees={filteredAffiliates}
					selectedPayGroupOption={selectedPayGroupOption}
					company={company}
				/>
			)}
		</PageLayout>
	);
};

export default AffiliateListView;
