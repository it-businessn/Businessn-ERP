import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import useSortableData from "hooks/useSortableData";
import { getAmount } from "utils/convertAmt";

const LedgerList = ({ accounts, setShowAccDetail, setAccName }) => {
	const cols = [
		"Account Code",
		"Account Name",
		"Total Journal Entries",
		"Total Debit",
		"Total Credit",
	];

	const { sortedItems, sortConfig, requestSort } = useSortableData(accounts);

	const showAccount = (accountName) => {
		setAccName(accountName);
		setShowAccDetail(true);
	};

	return (
		<TableLayout
			cols={cols}
			// height="calc(100vh - 380px)"
			position="sticky"
			top={-1}
			zIndex={1}
			textAlign="center"
			sortKeys={{
				"Account Code": "accCode",
				"Account Name": "accountName",
				"Total Journal Entries": "totalJournalEntries",
				"Total Debit": "totalDebit",
				"Total Credit": "totalCredit",
			}}
			sortConfig={sortConfig}
			onSort={requestSort}
		>
			<Tbody>
				{(!accounts || accounts?.length === 0) && (
					<EmptyRowRecord data={accounts} colSpan={cols.length} />
				)}
				{sortedItems?.map(
					({ _id, accCode, accountName, totalDebit, totalCredit, totalJournalEntries }) => {
						return (
							<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
								<Td p={0} px={"2em"} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={accCode} />
								</Td>
								<Td p={0} px={"2em"} borderBottomColor={"var(--filter_border_color)"}>
									<TextTitle
										color="var(--empName_bg)"
										size="sm"
										title={accountName}
										cursor="pointer"
										onClick={() => showAccount(accountName)}
									/>
								</Td>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={totalJournalEntries} />
								</Td>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={getAmount(totalDebit)} />
								</Td>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={getAmount(totalCredit)} />
								</Td>
							</Tr>
						);
					},
				)}
			</Tbody>
		</TableLayout>
	);
};

export default LedgerList;
