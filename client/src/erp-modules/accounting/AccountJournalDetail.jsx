import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import AccountService from "services/AccountService";
import { getAmount } from "utils/convertAmt";
import { getDefaultDate } from "utils/convertDate";

const AccountJournalDetail = ({ accName, company }) => {
	const [entries, setEntries] = useState(null);

	useEffect(() => {
		const fetchAccountJournalEntries = async () => {
			try {
				const { data } = await AccountService.getAccountJournalEntries(company, accName);
				setEntries(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAccountJournalEntries();
	}, []);

	const cols = ["Account Name", "Date", "Debit", "Credit"]; // "Journal Entries",

	return (
		<TableLayout
			cols={cols}
			// height="calc(100vh - 380px)"
			position="sticky"
			top={-1}
			zIndex={1}
			textAlign="center"
		>
			<Tbody>
				{(!entries || entries?.length === 0) && (
					<EmptyRowRecord data={entries} colSpan={cols.length} />
				)}
				{entries?.map(({ _id, transactionDate, accountName, credit, debit }) => {
					return (
						<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
							<Td p={0} px={"2em"} borderBottomColor={"var(--filter_border_color)"}>
								<TextTitle size="sm" title={accountName} />
							</Td>
							<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
								<NormalTextTitle
									size="sm"
									title={transactionDate && getDefaultDate(transactionDate)}
								/>
							</Td>
							<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
								<NormalTextTitle size="sm" title={getAmount(debit)} />
							</Td>
							<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
								<NormalTextTitle size="sm" title={getAmount(credit)} />
							</Td>
						</Tr>
					);
				})}
			</Tbody>
		</TableLayout>
	);
};

export default AccountJournalDetail;
