import {
	Box,
	HStack,
	IconButton,
	Input,
	Select,
	SimpleGrid,
	Stack,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useToast,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import PayrollActions from "erp-modules/payroll/workview/paygroup-header-table/PayrollActions";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import AccountService from "services/AccountService";
import LocalStorageService from "services/LocalStorageService";
import { getAmount } from "utils/convertAmt";
import { getDefaultDate } from "utils/convertDate";
import AddAccountModal from "./AddAccountModal";

const AccountingWorkview = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const [accounts, setAccounts] = useState(null);
	const [totalCredit, setTotalCredit] = useState(0);
	const [totalDebit, setTotalDebit] = useState(0);
	useEffect(() => {
		const fetchAllAccounts = async () => {
			try {
				const { data } = await AccountService.geAccount(company);
				setAccounts(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAccounts();
	}, []);

	const [showModal, setShowModal] = useState(false);
	const defaultJournalInfo = {
		transactionDate: null,
		description: "",
		entries: null,
		companyName: company,
	};

	const toast = useToast();

	const [formData, setFormData] = useState(defaultJournalInfo);
	const [rows, setRows] = useState([{ accountName: "", debit: "", credit: "" }]);

	const handleInputChange = (index, field, value) => {
		const updatedRows = [...rows];
		updatedRows[index][field] = value;
		setRows(updatedRows);
	};

	useEffect(() => {
		if (rows?.length > 0) {
			setTotalCredit(rows.reduce((sum, row) => sum + (parseFloat(row.credit) || 0), 0));
			setTotalDebit(rows.reduce((sum, row) => sum + (parseFloat(row.debit) || 0), 0));
		}
	}, [rows]);

	const addRow = () => {
		setRows([...rows, { account: "", debit: "", credit: "" }]);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		try {
			formData.entries = rows;
			if (totalCredit !== totalDebit) {
				toast({
					title: `Total Credit ${getAmount(totalCredit)} and Total Debit ${getAmount(
						totalDebit,
					)} do not match."`,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
				return;
			}
			const { data } = await AccountService.addJournalEntry(formData);
			if (data)
				toast({
					title: "Entry logged successful!",
					status: "success",
					duration: 1500,
					isClosable: true,
				});
		} catch (error) {
			console.error(error);
			toast({
				title: "Please try again.",
				status: "error",
				duration: 1500,
				isClosable: true,
			});
		}
	};

	const handleClick = (val) => {
		if (val === "add") {
			setShowModal(true);
		}
	};

	return (
		<PageLayout title="Workview">
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				my="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<BoxCard>
					<TextTitle title="New General Journal" />
					<Box minH={"40vh"} mt={5}>
						<HStack justifyContent="start" w="100%">
							<DateTimeFormControl
								label="Date"
								valueText1={
									formData.transactionDate ? getDefaultDate(formData.transactionDate) : ""
								}
								name1="transactionDate"
								handleChange={handleChange}
							/>
							<InputFormControl
								label="Description"
								name="description"
								placeholder="Enter Description"
								valueText={formData.description}
								handleChange={handleChange}
							/>
						</HStack>
						<Table variant="SMALL">
							<Thead>
								<Tr>
									<Th>
										<TextTitle title="Account" />
									</Th>
									<Th>
										<TextTitle title="Debit" />
									</Th>
									<Th>
										<TextTitle title="Credit" />
									</Th>
								</Tr>
							</Thead>
							<Tbody>
								{rows?.map((row, index) => (
									<Tr key={`${row.accountName}*${index}`}>
										<Td>
											<Select
												placeholder="Select account"
												value={row.accountName}
												onChange={(e) => handleInputChange(index, "accountName", e.target.value)}
											>
												{accounts?.map(({ _id, accountName }) => (
													<option key={`${_id}_${index}_********${index}`} value={accountName}>
														{accountName}
													</option>
												))}
											</Select>
										</Td>
										<Td>
											<Input
												type="number"
												value={row.debit}
												onChange={(e) => handleInputChange(index, "debit", e.target.value)}
											/>
										</Td>
										<Td>
											<Input
												type="number"
												value={row.credit}
												onChange={(e) => handleInputChange(index, "credit", e.target.value)}
											/>
										</Td>
									</Tr>
								))}
								<Tr>
									<Td>
										<NormalTextTitle size="sm" title="Totals" />
									</Td>
									<Td>
										<TextTitle title={totalDebit} />
									</Td>
									<Td>
										<TextTitle title={totalCredit} />
									</Td>
								</Tr>
							</Tbody>
						</Table>

						<HStack mt={4} spacing={0} onClick={addRow}>
							<IconButton
								size="lg"
								color="var(--primary_button_bg1)"
								icon={<FaPlusCircle />}
								aria-label="Print"
								variant="round"
							/>
							<PrimaryButton
								bg="var(--primary_button_bg1)"
								w="100px"
								size="xs"
								name="Add New Row"
								onOpen={addRow}
							/>
						</HStack>
					</Box>
					<Stack alignItems="end">
						<PrimaryButton
							bg="var(--primary_button_bg1)"
							w="100px"
							size="xs"
							name="Post"
							onOpen={handleSubmit}
						/>
					</Stack>
				</BoxCard>
				<PayrollActions
					title="Accounting Actions"
					handleClick={handleClick}
					actions={[
						{ key: "entry", name: "Add Entry" },
						{ key: "add", name: "Add Account" },
						{ key: "Invoice", name: "Add Invoice" },
						{ key: "Bill", name: "Add Bill" },
						{ key: "remove", name: "Import Bank Statement" },
					]}
				/>
			</SimpleGrid>
			{showModal && (
				<AddAccountModal company={company} showOnboard={showModal} setShowOnboard={setShowModal} />
			)}
		</PageLayout>
	);
};

export default AccountingWorkview;
