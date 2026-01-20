import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import VoPayService from "services/VoPayService";

export const ClientEmployeeList = ({ clientEmployees, company }) => {
	const getBankEmbedUrl = async (id) => {
		try {
			const { data } = await VoPayService.getEmployeeBankEmbedUrl(id);
			// const { data } = await VoPayService.getDefaultBankAccount(id);
			// const { data } = await VoPayService.setDefaultBankAccount({
			// 	ClientAccountID: id,
			// 	Token: "5vigt5lbw79013c2ro3ooupguhcwbiiu9mdse3s4h0qgwpuv132mm9w7pks2s01e",
			// });
			// const { data } = await VoPayService.fundBankAccount({
			// 	ClientAccountID: id,
			// 	Amount: 1,
			// });
			// const { data } = await VoPayService.getAccountBalance();
			// const transactions = await VoPayService.getTransactions(id);
			// const { data } = await VoPayService.requestTransferWithdraw({
			// 	RecipientClientAccountID: id,
			// 	Amount: 0,
			// 	company,
			// });
			if (data?.EmbedURL) window.open(data.EmbedURL, "_blank");
		} catch (error) {}
	};

	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<Th>Name</Th>
					<Th>Email</Th>
					<Th>Phone</Th>
					<Th>Address</Th>
					<Th>ClientType</Th>
					<Th>SINLastDigits</Th>
				</Tr>
			</Thead>
			<Tbody>
				{(!clientEmployees || clientEmployees?.length === 0) && (
					<EmptyRowRecord data={clientEmployees} colSpan={3} />
				)}
				{clientEmployees?.map((user) => (
					<Tr key={user?.ClientName} onClick={() => getBankEmbedUrl(user?.ClientAccountID)}>
						<Td>{user?.ClientName}</Td>
						<Td whiteSpace="pre-wrap">{user?.EmailAddress}</Td>
						<Td>{user?.PhoneNumber}</Td>
						<Td whiteSpace="pre-wrap">{`${user?.Address1}, ${user?.City} ${user?.Province} ${user?.Country} ${user?.PostalCode}`}</Td>
						<Td>{user?.ClientType}</Td> <Td>{user?.SINLastDigits}</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
