import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import useSortableData from "hooks/useSortableData";
import VoPayService from "services/VoPayService";

// TABLE-SORT: the address cell is built from its parts
const sortByAddress = (partner) =>
	`${partner?.Address}, ${partner?.City} ${partner?.Province} ${partner?.Country} ${partner?.PostalCode}`;

export const PartnerList = ({ partners, setClientAccountID }) => {
	const { sortedItems, sortConfig, requestSort } = useSortableData(partners);
	const getOnboardingLink = async (id) => {
		try {
			const { data } = await VoPayService.getAccountOnboardingLink(id);
			if (data?.OnboardingURL) window.open(data.OnboardingURL, "_blank");
		} catch (error) {}
	};

	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<SortableTh sortKey="AccountName" sortConfig={sortConfig} onSort={requestSort}>
						Name
					</SortableTh>
					<SortableTh sortKey="Email" sortConfig={sortConfig} onSort={requestSort}>
						Email
					</SortableTh>
					<SortableTh sortKey="Phone" sortConfig={sortConfig} onSort={requestSort}>
						Phone
					</SortableTh>
					<SortableTh sortKey={sortByAddress} sortConfig={sortConfig} onSort={requestSort}>
						Address
					</SortableTh>
					<SortableTh sortKey="AccountStatus" sortConfig={sortConfig} onSort={requestSort}>
						Status
					</SortableTh>
				</Tr>
			</Thead>
			<Tbody>
				{(!partners || partners?.length === 0) && <EmptyRowRecord data={partners} colSpan={5} />}
				{sortedItems?.map((partner) => (
					<Tr key={partner?.AccountID} onClick={() => getOnboardingLink(partner?.AccountID)}>
						<Td>{partner?.AccountName}</Td>
						<Td whiteSpace="pre-wrap">{partner?.Email}</Td>
						<Td>{partner?.Phone}</Td>
						<Td whiteSpace="pre-wrap">{`${partner?.Address}, ${partner?.City} ${partner?.Province} ${partner?.Country} ${partner?.PostalCode}`}</Td>
						<Td>{partner?.AccountStatus}</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
