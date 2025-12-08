import { useEffect, useState } from "react";
import VoPayService from "services/VoPayService";
import { ConfigTabLayout } from "../../../components/ConfigTabLayout";
import PartnerForm from "./PartnerForm";
import { PartnerList } from "./PartnerList";

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
		fetchPartnerAccounts();
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
				tableData={partners}
				tableTitle="TechCorp Ltd"
				tableContent={<ClientEmployeeList clientEmployees={wallets} />}
				leftContent={<EmployerWalletFundForm setRefresh={setRefresh} />}
			/> */}
		</>
	);
};

export default VoPayPanel;
