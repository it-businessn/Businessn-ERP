import {
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	Select,
	SimpleGrid,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import AccountJournalDetail from "erp-modules/accounting/AccountJournalDetail";
import AddAccountModal from "erp-modules/accounting/AddAccountModal";
import PayrollActions from "erp-modules/payroll/workview/paygroup-header-table/PayrollActions";
import useCompany from "hooks/useCompany";
import useCrews from "hooks/useCrews";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiUserCheck, FiUserPlus, FiUserX } from "react-icons/fi";
import AccountService from "services/AccountService";
import LocalStorageService from "services/LocalStorageService";
import BudgetList from "./BudgetList";

const ACTIONS = [
	{ key: "add", name: "Add Account", icon: FiUserPlus },
	{ key: "change", name: "Change Account", icon: FiUserCheck },
	{ key: "remove", name: "Remove Account", icon: FiUserX },
];

const BudgetingWorkview = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const { crews, selectedCrew, setSelectedCrew } = useCrews(company);

	const [showAccDetail, setShowAccDetail] = useState(false);
	const [accounts, setAccounts] = useState(null);
	const [filteredAccounts, setFilteredAccounts] = useState(null);

	const [showModal, setShowModal] = useState(false);
	const [accName, setAccName] = useState("");

	useEffect(() => {
		const fetchAllAccounts = async () => {
			try {
				const { data } = await AccountService.getAllAccountsByDept(company, selectedCrew);
				setAccounts(data);
				setFilteredAccounts(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedCrew) fetchAllAccounts();
	}, [selectedCrew]);

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
		<PageLayout title={"Budget Summary"}>
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
							isDisabled={!selectedCrew}
							size="xs"
							px={0}
							onOpen={() => setShowModal(true)}
						/>
					</HStack>
				</VStack>

				<PayrollActions
					title="Chart of Account Actions"
					handleClick={handleClick}
					actions={ACTIONS}
				/>
			</SimpleGrid>
			<HStack w="30%" alignItems="center" justifyContent="start" mb="2px">
				<TextTitle width="fit-content" title={"Budget:"} />
				<Select
					size={"sm"}
					w={"200px"}
					border="1px solid var(--primary_button_bg)"
					borderRadius="10px"
					value={selectedCrew}
					placeholder="Select budget"
					onChange={(e) => e.target.value && setSelectedCrew(e.target.value)}
				>
					{crews?.map(({ name, _id }) => (
						<option value={name} key={_id}>
							{`${name} FY 2026`}
						</option>
					))}
				</Select>
			</HStack>
			{showAccDetail ? (
				<AccountJournalDetail accName={accName} company={company} />
			) : (
				<BudgetList
					setShowAccDetail={setShowAccDetail}
					setAccName={setAccName}
					accounts={filteredAccounts}
					company={company}
				/>
			)}
			{showModal && (
				<AddAccountModal
					company={company}
					selectedCrew={selectedCrew}
					showOnboard={showModal}
					setShowOnboard={setShowModal}
				/>
			)}
		</PageLayout>
	);
};

export default BudgetingWorkview;
