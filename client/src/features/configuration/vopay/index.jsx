import { useEffect, useState } from "react";
import VoPayService from "services/VoPayService";
import { ConfigTabLayout } from "../../../components/ConfigTabLayout";
import EmployerWalletFundForm from "./EmployerWalletFundForm";
import { PartnerList } from "./PartnerList";
import { ClientEmployeeList } from "./ClientEmployeeList";

const VoPayPanel = ({ companyName }) => {
	const [partners, setPartners] = useState(null);
	const [wallets, setWallets] = useState(null);
	const [refresh, setRefresh] = useState(null);

	useEffect(() => {
		const fetchPartnerAccounts = async () => {
			try {
				const { data } = await VoPayService.getPartnerEmployerAccounts();
				setPartners(Object.values(data.Accounts));
			} catch (error) {
				console.error(error);
			}
		};
		const fetchClientAccountWallets = async () => {
			try {
				const { data } = await VoPayService.getClientAccountWallets();
				setWallets(Object.values(data.ClientAccounts));
			} catch (error) {
				console.error(error);
			}
		};
		fetchPartnerAccounts();
		fetchClientAccountWallets();
	}, [refresh]);

	return (
		<>
			<ConfigTabLayout
				tableData={partners}
				tableTitle="Vopay Accounts"
				tableContent={<PartnerList partners={partners} />}
				leftContent={<EmployerWalletFundForm setRefresh={setRefresh} />}
			/>
			{/* <ConfigTabLayout
				tableData={partners}
				tableTitle="TechCorp Ltd"
				tableContent={<ClientEmployeeList clientEmployees={wallets} />}
				leftContent={<EmployerWalletFundForm setRefresh={setRefresh} />}
			/> */}
		</>
	);
};

export default VoPayPanel;
