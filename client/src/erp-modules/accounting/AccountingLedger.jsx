import {
	Checkbox,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	SimpleGrid,
	Stack,
	VStack,
} from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import OtherFilter from "erp-modules/payroll/timesheets/OtherFilter";
import PayrollActions from "erp-modules/payroll/workview/paygroup-header-table/PayrollActions";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { FiUserCheck, FiUserPlus, FiUserX } from "react-icons/fi";
import AccountService from "services/AccountService";
import LocalStorageService from "services/LocalStorageService";
import AccountJournalDetail from "./AccountJournalDetail";
import AddAccountModal from "./AddAccountModal";
import LedgerList from "./LedgerList";

const ACTIONS = [
	{ key: "add", name: "Add Account", icon: FiUserPlus },
	{ key: "change", name: "Change Account", icon: FiUserCheck },
	{ key: "remove", name: "Remove Account", icon: FiUserX },
];

const AccountingLedger = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const [formData, setFormData] = useState({
		isPayrollActive: true,
		isPayrollInactive: false,
	});

	const [showAccDetail, setShowAccDetail] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const [accounts, setAccounts] = useState(null);
	const [filteredAccounts, setFilteredAccounts] = useState(null);

	useEffect(() => {
		const fetchAllAccounts = async () => {
			try {
				const { data } = await AccountService.getAllAccounts(company);
				setAccounts(data);
				setFilteredAccounts(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAccounts();
	}, [isRefresh]);

	const [showAccFilter, setShowAccFilter] = useState(false);
	const [showDeptFilter, setShowDeptFilter] = useState(false);
	const [showCCFilter, setShowCCFilter] = useState(false);

	const toggleEmpFilter = () => setShowAccFilter((prev) => !prev);
	const toggleDeptFilter = () => setShowDeptFilter((prev) => !prev);
	const toggleCCFilter = () => setShowCCFilter((prev) => !prev);
	const handleFilter = () => console.log(filteredAccounts);

	const [filteredDept, setFilteredDept] = useState([]);
	const [filteredCC, setFilteredCC] = useState([]);

	const [showModal, setShowModal] = useState(false);
	const [accName, setAccName] = useState("");

	const handleClick = (val) => {
		if (val === "add") {
			setShowModal(true);
		}
	};

	const handleInputChange = (value) => {
		setAccName(value);
		setFilteredAccounts(
			accounts.filter((acc) => acc?.accountName.toLowerCase().includes(value.toLowerCase())),
		);
	};

	return (
		<PageLayout
			title={showAccDetail ? "Record of Bucket Movement" : "General Ledger Summary"}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
		>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				my="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<VStack>
					<HStack w={"100%"} spacing={2} justifyContent={"space-between"}>
						<VStack spacing={1} w={"30%"} align={"start"} zIndex={2}>
							<InputGroup
								borderRadius={"10px"}
								border={"1px solid var(--filter_border_color)"}
								fontSize="xs"
								fontWeight="bold"
								size="xs"
							>
								<Input
									_placeholder={{
										color: "var(--nav_color)",
										fontSize: "sm",
									}}
									size="xs"
									name="accName"
									value={accName}
									onChange={(e) => handleInputChange(e.target.value)}
									color={"var(--nav_color)"}
									bg={"var(--primary_bg)"}
									type="text"
									placeholder="Search account"
									pr="4.5rem"
									py="1.1em"
								/>
								<InputRightElement size="xs" children={<FaSearch />} />
							</InputGroup>
						</VStack>
						<PrimaryButton
							name={"Add Account"}
							size="xs"
							px={0}
							onOpen={() => setShowModal(true)}
						/>
					</HStack>
					<HStack
						w={"100%"}
						pt={"5em"}
						spacing={"3em"}
						alignItems="self-start"
						justifyContent={"start"}
					>
						<HStack>
							<Stack alignItems="self-start">
								<HStack spacing={2}>
									<Checkbox
										colorScheme={"facebook"}
										isChecked={formData?.isPayrollActive}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												isPayrollActive: e.target.checked,
											}))
										}
									>
										Active
									</Checkbox>
									<Checkbox
										colorScheme={"facebook"}
										isChecked={formData?.isPayrollInactive}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												isPayrollInactive: e.target.checked,
											}))
										}
									>
										Inactive
									</Checkbox>
								</HStack>
								{showAccDetail && (
									<LeftIconButton
										color={"var(--nav_color)"}
										name={"Go Back"}
										variant={"ghost"}
										isFilter
										size="xs"
										handleClick={() => setShowAccDetail(false)}
										icon={<FaArrowLeft />}
									/>
								)}
							</Stack>
						</HStack>
						<HStack>
							<OtherFilter
								showOtherFilter={showAccFilter}
								toggleOtherFilter={toggleEmpFilter}
								handleFilter={handleFilter}
								data={accounts}
								filteredData={filteredAccounts}
								setFilteredData={setFilteredAccounts}
								helperText="Account Type"
								type="accountName"
							/>
							{/* <OtherFilter
								showOtherFilter={showDeptFilter}
								toggleOtherFilter={toggleDeptFilter}
								handleFilter={handleFilter}
								data={employees}
								filteredData={filteredDept}
								setFilteredData={setFilteredDept}
								helperText="department"
							/>
							<OtherFilter
								showOtherFilter={showCCFilter}
								toggleOtherFilter={toggleCCFilter}
								handleFilter={handleFilter}
								data={employees}
								filteredData={filteredCC}
								setFilteredData={setFilteredCC}
								helperText="cost center"
							/> */}
						</HStack>
					</HStack>
				</VStack>

				<PayrollActions
					title="Chart of Account Actions"
					handleClick={handleClick}
					actions={ACTIONS}
				/>
			</SimpleGrid>
			{showAccDetail ? (
				<AccountJournalDetail accName={accName} company={company} />
			) : (
				<LedgerList
					setShowAccDetail={setShowAccDetail}
					setAccName={setAccName}
					accounts={filteredAccounts}
					company={company}
				/>
			)}
			{showModal && (
				<AddAccountModal
					company={company}
					showOnboard={showModal}
					setShowOnboard={setShowModal}
					setIsRefresh={setIsRefresh}
				/>
			)}
		</PageLayout>
	);
};

export default AccountingLedger;
