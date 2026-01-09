import { HStack, Select } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import useCrews from "hooks/useCrews";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import BudgetService from "services/BudgetService";
import LocalStorageService from "services/LocalStorageService";
import AddBudgetAccountModal from "./AddBudgetAccountModal";
import BudgetList from "./BudgetList";
import BudgetQuickActions from "./BudgetQuickActions";

const BudgetingWorkview = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const { crews, selectedCrew, setSelectedCrew } = useCrews(company);
	const [dept, setDept] = useState(null);

	const [refresh, setRefresh] = useState(false);
	const [accounts, setAccounts] = useState(null);
	const [filteredAccounts, setFilteredAccounts] = useState(null);

	const [showModal, setShowModal] = useState(false);
	const [accName, setAccName] = useState("");

	useEffect(() => {
		if (crews) {
			setDept([...crews, { _id: "NoDept", name: "No department assigned" }]);
		}
	}, [crews]);

	useEffect(() => {
		const fetchDeptBudgetAccounts = async () => {
			try {
				const { data } = await BudgetService.getDeptBudgetAccounts(company, selectedCrew);
				setAccounts(data);
				setFilteredAccounts(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedCrew) {
			fetchDeptBudgetAccounts();
		}
	}, [selectedCrew, refresh]);

	const handleInputChange = (value) => {
		setAccName(value);
		setFilteredAccounts(
			accounts.filter((acc) => acc?.accountName.toLowerCase().includes(value.toLowerCase())),
		);
	};

	return (
		<PageLayout title={"Budget Summary"}>
			<BudgetQuickActions
				setShowModal={setShowModal}
				selectedCrew={selectedCrew}
				handleInputChange={handleInputChange}
				accName={accName}
			/>
			<HStack w="30%" alignItems="center" justifyContent="start" mb="2px">
				<TextTitle width="fit-content" title={"Budget:"} />
				<Select
					size={"sm"}
					w={"200px"}
					border="1px solid var(--primary_button_bg)"
					borderRadius="10px"
					value={selectedCrew || ""}
					placeholder="Select budget"
					onChange={(e) => e.target.value && setSelectedCrew(e.target.value)}
				>
					{dept?.map(({ name, _id }) => (
						<option value={name} key={_id}>
							{`${name} FY 2026`}
						</option>
					))}
				</Select>
			</HStack>
			<BudgetList filteredAccounts={filteredAccounts} setFilteredAccounts={setFilteredAccounts} />
			{showModal && (
				<AddBudgetAccountModal
					company={company}
					isOpen={showModal}
					setShowModal={setShowModal}
					crews={dept}
					setRefresh={setRefresh}
				/>
			)}
		</PageLayout>
	);
};

export default BudgetingWorkview;
