import { useEffect, useState } from "react";
import VoPayService from "services/VoPayService";
import { ConfigTabLayout } from "../../../components/ConfigTabLayout";
import PartnerForm from "./PartnerForm";
import { PartnerList } from "./PartnerList";
import { ClientEmployeeList } from "./ClientEmployeeList";
import ClientEmployeeForm from "./ClientEmployeeForm";

const VoPayPanel = ({ companyName }) => {
	const [partners, setPartners] = useState(null);
	const [wallets, setWallets] = useState(null);
	const [refresh, setRefresh] = useState(null);
	// const webhookEvent = useVoPayEvents();

	useEffect(() => {
		const fetchPartnerAccounts = async () => {
			try {
				const { data } = await VoPayService.getPartnerEmployerAccounts();
				setPartners(Object.values(data.Accounts));
			} catch (error) {
				console.error(error);
			}
		};
		const fetchClientAccounts = async () => {
			try {
				const { data } = await VoPayService.getClientAccountWallets();
				setWallets(Object.values(data.ClientAccounts));
			} catch (error) {
				console.error(error);
			}
		};
		fetchPartnerAccounts();
		// fetchClientAccounts();
	}, [refresh]);

	return (
		<>
			{/* <div>
				<h2>Webhook Status</h2>
				{webhookEvent ? (
					<pre>{JSON.stringify(webhookEvent, null, 2)}</pre>
				) : (
					<p>No events received yet...</p>
				)}
			</div> */}
			<ConfigTabLayout
				tableData={partners}
				tableTitle="Vopay Accounts"
				tableContent={<PartnerList partners={partners} />}
				leftContent={<PartnerForm setRefresh={setRefresh} />}
			/>
			{/* <ConfigTabLayout
				tableData={wallets}
				tableTitle="Client Accounts"
				tableContent={<ClientEmployeeList clientEmployees={wallets} />}
				leftContent={<ClientEmployeeForm setRefresh={setRefresh} />}
			/> */}
		</>
	);
};

export default VoPayPanel;
