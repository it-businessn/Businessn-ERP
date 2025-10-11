import { Tbody, Td, Tr, useToast } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { EditableInputControl } from "erp-modules/payroll/controls/EditableInputControl";
import BudgetService from "services/BudgetService";

const BudgetList = ({ filteredAccounts, setFilteredAccounts }) => {
	const toast = useToast();

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

	const handleUpdateData = async (id, field, value) => {
		try {
			const recordToUpdate = filteredAccounts?.find((record) => record._id === id);
			if (!recordToUpdate) return;
			const updatedRecord = {
				...recordToUpdate,
				monthlyBudget: {
					...recordToUpdate.monthlyBudget,
					[field]: value,
				},
			};
			const updatedData = filteredAccounts.map((record) =>
				record._id === id ? updatedRecord : record,
			);
			setFilteredAccounts(updatedData);
			await BudgetService.updateAccount(updatedRecord, id);
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
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
				{!filteredAccounts && <EmptyRowRecord data={filteredAccounts} colSpan={cols.length} />}
				{filteredAccounts?.map(({ _id, accCode, accountName, monthlyBudget }) => {
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
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Sep}
									onSave={(nextValue) => handleUpdateData(_id, "Sep", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Oct}
									onSave={(nextValue) => handleUpdateData(_id, "Oct", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Nov}
									onSave={(nextValue) => handleUpdateData(_id, "Nov", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Dec}
									onSave={(nextValue) => handleUpdateData(_id, "Dec", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Jan}
									onSave={(nextValue) => handleUpdateData(_id, "Jan", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Feb}
									onSave={(nextValue) => handleUpdateData(_id, "Feb", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Mar}
									onSave={(nextValue) => handleUpdateData(_id, "Mar", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Apr}
									onSave={(nextValue) => handleUpdateData(_id, "Apr", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.May}
									onSave={(nextValue) => handleUpdateData(_id, "May", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Jun}
									onSave={(nextValue) => handleUpdateData(_id, "Jun", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Jul}
									onSave={(nextValue) => handleUpdateData(_id, "Jul", nextValue)}
								/>
							</Td>
							<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
								<EditableInputControl
									value={monthlyBudget?.Aug}
									onSave={(nextValue) => handleUpdateData(_id, "Aug", nextValue)}
								/>
							</Td>
						</Tr>
					);
				})}
			</Tbody>
		</TableLayout>
	);
};

export default BudgetList;
