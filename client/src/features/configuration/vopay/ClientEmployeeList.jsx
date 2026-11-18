import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import useSortableData from "hooks/useSortableData";
import VoPayService from "services/VoPayService";

// TABLE-SORT: the address cell is built from its parts
const sortByAddress = (user) =>
	`${user?.Address1}, ${user?.City} ${user?.Province} ${user?.Country} ${user?.PostalCode}`;

export const ClientEmployeeList = ({ clientEmployees, company }) => {
	const { sortedItems, sortConfig, requestSort } = useSortableData(clientEmployees);
	const getBankEmbedUrl = async (id) => {
		try {
			// const { data } = await VoPayService.getEmployeeBankEmbedUrl(id);
			// const { data } = await VoPayService.getLinkedBankAccounts(id);
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
			// if (data?.EmbedURL) window.open(data.EmbedURL, "_blank");
		} catch (error) {}
	};

	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<SortableTh sortKey="ClientName" sortConfig={sortConfig} onSort={requestSort}>
						Name
					</SortableTh>
					<SortableTh sortKey="EmailAddress" sortConfig={sortConfig} onSort={requestSort}>
						Email
					</SortableTh>
					<SortableTh sortKey="PhoneNumber" sortConfig={sortConfig} onSort={requestSort}>
						Phone
					</SortableTh>
					<SortableTh sortKey={sortByAddress} sortConfig={sortConfig} onSort={requestSort}>
						Address
					</SortableTh>
					<SortableTh sortKey="ClientType" sortConfig={sortConfig} onSort={requestSort}>
						ClientType
					</SortableTh>
					<SortableTh sortKey="SINLastDigits" sortConfig={sortConfig} onSort={requestSort}>
						SINLastDigits
					</SortableTh>
				</Tr>
			</Thead>
			<Tbody>
				{(!clientEmployees || clientEmployees?.length === 0) && (
					<EmptyRowRecord data={clientEmployees} colSpan={6} />
				)}
				{sortedItems?.map((user) => (
					<Tr key={user?.ClientAccountID || user?.ClientName} onClick={() => getBankEmbedUrl(user?.ClientAccountID)}>
						<Td>{user?.ClientName}</Td>
						<Td whiteSpace="pre-wrap">{user?.EmailAddress}</Td>
						<Td>{user?.PhoneNumber}</Td>
						<Td whiteSpace="pre-wrap">{`${user?.Address1}, ${user?.City} ${user?.Province} ${user?.Country} ${user?.PostalCode}`}</Td>
						<Td>{user?.ClientType}</Td>
						<Td>{user?.SINLastDigits}</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
