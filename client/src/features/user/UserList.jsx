import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spacer,
	Text,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { PersonalInfoCard } from "components";
import { signUpFormFields } from "config/formfields";
import { UserSchema } from "config/schema";
import { TOAST } from "constant";

import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { userCurrency } from "utils";

const UserList = ({ employees }) => {
	const loggedInUser = LocalStorageService.getItem("user");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [users, setMembers] = useState(employees);
	const [record, setRecord] = useState(null);
	const [userFormInitialValues, setUserFormInitialValues] = useState(null);
	const toast = useToast();
	const handleSubmit = async (values) => {
		try {
			const updateData = await UserService.updateUserById(values, record._id, loggedInUser.token);
			toast(TOAST.SUCCESS);
			onClose();
		} catch (error) {
			toast(TOAST.ERROR);
			// setError(error.response.data.error);
			console.log(error);
		}
	};
	const processPayroll = async () => {
		try {
			// console.log(selectedUsers);
			// selectedUsers.map((item) => delete item._id);
			// const updateData = await api.processPayroll(
			//     selectedUsers,
			//     user.token
			// );
			// toast(TOAST.SUCCESS);
			// onClose();
		} catch (error) {
			toast(TOAST.ERROR);
			// setError(error.data.error);
			console.log(error);
		}
	};
	const openModal = (employee) => {
		setRecord(employee);
		setUserFormInitialValues({
			firstName: employee.firstName,
			middleName: employee.middleName,
			lastName: employee.lastName,
			email: employee.email,
			password: employee.password,
			role: employee.role,
			annualSalary: employee.annualSalary,
			dateOfJoining: employee.dateOfJoining,
			phoneNumber: employee.phoneNumber,
			streetNumber: employee.address.streetNumber,
			city: employee.address.city,
			state: employee.address.state,
			postalCode: employee.address.postalCode,
			country: employee.address.country,
		});
		onOpen();
	};
	useEffect(() => {
		initFilters();
	}, []);
	const [filters, setFilters] = useState(null);
	const [loading, setLoading] = useState(false);
	const [globalFilterValue, setGlobalFilterValue] = useState("");
	const setRowDatay = (e) => setRowData(e.rowData);
	const [rowData, setRowData] = useState(null);
	const initFilters = () => {
		setFilters({
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },

			annualSalary: {
				operator: FilterOperator.AND,
				constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
			},
		});
		setGlobalFilterValue("");
	};
	const balanceFilterTemplate = (options) => {
		return (
			<InputNumber
				value={options.value}
				onChange={(e) => options.filterCallback(e.value, options.index)}
				mode="currency"
				currency="USD"
				locale="en-US"
			/>
		);
	};
	const [selectedUsers, setSelectedUsers] = useState(null);
	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		let _filters = { ...filters };

		_filters["global"].value = value;

		setFilters(_filters);
		setGlobalFilterValue(value);
	};
	const clearFilter = () => {
		initFilters();
	};
	return (
		<>
			<Flex justify="space-between" gap={2}>
				<Heading size="xs">Employee</Heading>
				<Spacer />
				<Button
					isDisabled={selectedUsers === null ? true : selectedUsers?.length < 1}
					variant="primary"
					onClick={processPayroll}
				>
					Process Payroll
				</Button>
				<Button variant="outline" onClick={clearFilter}>
					Clear
				</Button>
				<span className="p-input-icon-left">
					<i className="pi pi-search" />
					<Input
						value={globalFilterValue}
						onChange={onGlobalFilterChange}
						placeholder="Keyword Search"
					/>
				</span>
			</Flex>
			<div className="card">
				<DataTable
					selectionMode="checkbox"
					selection={selectedUsers}
					onSelectionChange={(e) => {
						setSelectedUsers(e.value);
					}}
					onRowClick={(e) => openModal(e.data)}
					dataKey="_id"
					value={employees}
					removableSort
					size="small"
					resizableColumns
					paginator
					filters={filters}
					globalFilterFields={["annualSalary"]}
					rows={11}
					rowsPerPageOptions={[5, 10, 25, 50]}
					tableStyle={{ whiteSpace: "pre-line" }}
				>
					<Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
					<Column
						field="name"
						body={(value) => (
							<HStack spacing="3">
								<Avatar name={value.name} src="" w="2.5rem" h="2.5rem" fontSize="1rem" />
								<Box>
									<Text textTransform="capitalize">{value.name}</Text>
								</Box>
							</HStack>
						)}
						sortable
						header="Name"
					></Column>
					<Column field="email" sortable header="Email"></Column>
					<Column field="role" sortable header="Role"></Column>
					<Column field="department" header="Department"></Column>
					<Column
						field="annualSalary"
						sortable
						filterField="annualSalary"
						dataType="numeric"
						filter
						filterElement={balanceFilterTemplate}
						body={(value) => {
							<>
								{value?.annualSalary
									? userCurrency(value.bankDetails.currency).format(value.annualSalary)
									: 0}
							</>;
						}}
						header="Annual Salary"
					></Column>
					<Column style={{ cursor: "pointer" }} body={<FiEdit2 />} header="Action"></Column>
				</DataTable>
			</div>
			{record && (
				<Modal size="3xl" isCentered isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Edit Record</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<PersonalInfoCard
								formSubmit={handleSubmit}
								schema={UserSchema}
								initialValues={userFormInitialValues}
								formFields={signUpFormFields}
							/>
						</ModalBody>
					</ModalContent>
				</Modal>
			)}
		</>
	);
};
export default UserList;
