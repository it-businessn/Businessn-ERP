import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { getAmount } from "utils/convertAmt";
import { getDefaultDate } from "utils/convertDate";

const LedgerList = ({ accounts }) => {
	const cols = [
		"Account Code",
		"Account Name",
		"Description",
		"Journal Entry#",
		"Date",
		"Debit",
		"Credit",
	];

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
				{(!accounts || accounts?.length === 0) && (
					<EmptyRowRecord data={accounts} colSpan={cols.length} />
				)}
				{accounts?.map(
					({
						_id,
						accCode,
						accountName,
						credit,
						debit,
						description,
						transactionDate,
						journalEntryNum,
					}) => {
						return (
							<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
								<Td p={0} px={"2em"} borderBottomColor={"var(--filter_border_color)"}>
									<TextTitle size="sm" title={accCode} />
								</Td>
								<Td p={0} px={"2em"} borderBottomColor={"var(--filter_border_color)"}>
									<TextTitle size="sm" title={accountName} />
								</Td>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={description} />
								</Td>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={journalEntryNum} />
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
					},
				)}
			</Tbody>
		</TableLayout>
	);
};

export default LedgerList;
