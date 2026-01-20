import { Divider, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import VoPayService from "services/VoPayService";
import { ConfigTabLayout } from "../../../components/ConfigTabLayout";
import ClientEmployeeForm from "./ClientEmployeeForm";
import { ClientEmployeeList } from "./ClientEmployeeList";
import PartnerForm from "./PartnerForm";
import { PartnerList } from "./PartnerList";

const VoPayPanel = ({ company }) => {
	const [partners, setPartners] = useState(null);
	const [wallets, setWallets] = useState(null);
	const [refresh, setRefresh] = useState(null);
	const [clientAccountID, setClientAccountID] = useState(null);
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
		const getWebHooks = async (id) => {
			try {
				const { data } = await VoPayService.getWebHooks();
			} catch (error) {}
		};
		getWebHooks();
		// fetchPartnerAccounts();
		fetchClientAccounts();
	}, [refresh]);

	return (
		<Stack>
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
				tableContent={<PartnerList partners={partners} setClientAccountID={setClientAccountID} />}
				leftContent={<PartnerForm setRefresh={setRefresh} />}
			/>
			<Divider />
			<ConfigTabLayout
				tableData={wallets}
				tableTitle="Client Accounts"
				tableContent={<ClientEmployeeList clientEmployees={wallets} company={company} />}
				leftContent={
					<ClientEmployeeForm setRefresh={setRefresh} ClientAccountID={clientAccountID} />
				}
			/>
		</Stack>
	);
};

export default VoPayPanel;
