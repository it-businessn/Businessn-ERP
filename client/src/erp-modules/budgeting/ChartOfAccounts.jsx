import { ConfigTabLayout } from "components/ConfigTabLayout";
import useCrews from "hooks/useCrews";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import AccountService from "services/AccountService";
import LocalStorageService from "services/LocalStorageService";
import AccountForm from "./AccountForm";
import AccountsList from "./AccountsList";

const ChartOfAccounts = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const { crews } = useCrews(company);

	const [dept, setDept] = useState(null);
	const [accounts, setAccounts] = useState(null);
	const [filteredAccounts, setFilteredAccounts] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const defaultFormData = {
		accCode: "",
		accountName: "",
		companyName: company,
		department: "",
	};
	const [formData, setFormData] = useState(defaultFormData);

	useEffect(() => {
		if (crews) {
			setDept([...crews, { _id: "NoDept", name: "No department assigned" }]);
		}
	}, [crews]);

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
	}, []);

	const handleEdit = (acc) => {
		setEditingId(acc._id);
		setFormData((prevData) => ({
			...prevData,
			accCode: acc?.accCode,
			accountName: acc?.accountName,
			department: acc?.department || "",
		}));
	};

	const handleClose = () => {
		setEditingId(null);
		setFormData(defaultFormData);
	};

	return (
		<PageLayout>
			<ConfigTabLayout
				tableData={accounts}
				tableTitle="All Accounts"
				tableContent={<AccountsList accounts={accounts} handleEdit={handleEdit} />}
				leftContent={
					<AccountForm
						editingId={editingId}
						onClose={handleClose}
						formData={formData}
						setAccounts={setAccounts}
						setFormData={setFormData}
						dept={dept}
					/>
				}
			/>
		</PageLayout>
	);
};

export default ChartOfAccounts;
