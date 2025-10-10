import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { EditableInputControl } from "erp-modules/payroll/controls/EditableInputControl";

const BudgetList = ({ accounts, setShowAccDetail, setAccName }) => {
	const cols = [
		"Account Code",
		"Account Name",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
	];

	const showAccount = (accountName) => {
		setAccName(accountName);
		setShowAccDetail(true);
	};
	const handleUpdateData = (id, field, value) => {
		// const updatedData = contributionData?.map((record) =>
		// 	record?.empId?._id === id ? { ...record, [field]: value } : record,
		// );
		// setContributionData(updatedData);
		// handleSave(updatedData);
	};
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
				{!accounts && <EmptyRowRecord data={accounts} colSpan={cols.length} />}
				{accounts?.map(
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
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<EditableInputControl
										value={5}
										onSave={(nextValue) => handleUpdateData(_id, "field", nextValue)}
									/>
								</Td>
							</Tr>
						);
					},
				)}
			</Tbody>
		</TableLayout>
	);
};

export default BudgetList;
