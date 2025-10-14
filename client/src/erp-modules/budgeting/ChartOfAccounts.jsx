import { EditIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import AccountService from "services/AccountService";
import LocalStorageService from "services/LocalStorageService";

const ChartOfAccounts = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const [accounts, setAccounts] = useState(null);
	const [filteredAccounts, setFilteredAccounts] = useState(null);

	useEffect(() => {
		const fetchAllAccounts = async () => {
			try {
				const { data } = await AccountService.getAllAccounts(company);
				setAccounts(data);
				setFilteredAccounts(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAccounts();
	}, []);

	return (
		<PageLayout title="Accounts">
			<Table variant="simple" size="sm">
				<Thead>
					<Tr>
						<Th>Account Code</Th>
						<Th>Account Name</Th>
						<Th>Department</Th>
						<Th>Action</Th>
					</Tr>
				</Thead>
				<Tbody>
					{(!accounts || accounts?.length === 0) && <EmptyRowRecord data={accounts} colSpan={3} />}
					{accounts?.map((acc) => (
						<Tr key={acc?._id}>
							<Td>{acc?.accCode}</Td>
							<Td>{acc?.accountName}</Td>
							<Td>{acc?.department}</Td>
							<Td>
								<HStack spacing={2}>
									<IconButton
										aria-label="Edit "
										icon={<EditIcon />}
										size="sm"
										// onClick={() => handleEdit(role)}
										color="var(--banner_bg)"
										_hover={{
											bg: "var(--banner_bg)",
											color: "white",
										}}
									/>
									{/* <IconButton
											aria-label="Delete "
											icon={<DeleteIcon />}
											size="sm"
											color="var(--banner_bg)"
											_hover={{
												bg: "var(--banner_bg)",
												color: "white",
											}}
											onClick={() => {
												// setShowConfirmationPopUp(true);
												// setDeleteRecordId(holiday._id);
											}}
										/> */}
								</HStack>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</PageLayout>
	);
};

export default ChartOfAccounts;
