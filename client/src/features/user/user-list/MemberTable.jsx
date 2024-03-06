import {
	Box,
	Checkbox,
	HStack,
	Icon,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import { PersonalInfoCard } from "components";
import { signUpFormFields } from "config/formfields";
import { UserSchema } from "config/schema";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoArrowDown } from "react-icons/io5";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { userCurrency } from "utils";

export const MemberTable = (props) => {
	const [record, setRecord] = useState(null);
	const user = LocalStorageService.getItem("user");
	const [userFormInitialValues, setUserFormInitialValues] = useState(null);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const openModal = (employee) => {
		setRecord(employee);
		setUserFormInitialValues({
			firstName: employee.firstName,
			middleName: employee.middleName,
			lastName: employee.lastName,
			email: employee.email,
			password: employee.password,
			role: employee.role,
			department: employee.department,
			annualSalary: employee.annualSalary,
			dateOfJoining: employee.dateOfJoining,
			phoneNumber: employee.phoneNumber,
			// streetNumber: employee.address.streetNumber,
			// city: employee.address.city,
			// state: employee.address.state,
			// postalCode: employee.address.postalCode,
			// country: employee.address.country,
		});
		onOpen();
	};
	const handleSubmit = async (values) => {
		try {
			const updateData = await UserService.updateUserById(
				record._id,
				values,
				user?.token,
			);
			if (updateData) {
				props.update(true);
			}
			// toast(TOAST.SUCCESS);
			onClose();
		} catch (error) {
			// toast(TOAST.ERROR);
			// setError(error.response.data.error);
			console.log(error);
		}
	};
	return (
		<>
			<Table {...props} p={0} size="sm">
				<Thead>
					<Tr>
						<Th>
							<HStack spacing="3">
								{props.isEditable && <Checkbox />}
								<HStack spacing="1">
									<Text>Name</Text>
									<Icon as={IoArrowDown} color="muted" boxSize="4" />
								</HStack>
							</HStack>
						</Th>
						{/* <Th>Status</Th> */}
						<Th>Email</Th>
						<Th>Role</Th>
						<Th>Department</Th>
						<Th> Salary</Th>
						<Th></Th>
					</Tr>
				</Thead>
				<Tbody>
					{props.employees.map((member) => (
						<Tr key={member._id}>
							<Td>
								<HStack spacing="3">
									{props.isEditable && <Checkbox />}
									{/* <Avatar
                                name={member.name}
                                src={member.avatarUrl}
                                boxSize="10"
                            /> */}
									<Box>
										<Text fontWeight="medium">
											{member.firstName + " " + member.lastName}
										</Text>
										{/* <Text color="muted">{member.handle}</Text> */}
									</Box>
								</HStack>
							</Td>
							{/* <Td>
                        <Badge
                            size="sm"
                            colorScheme={
                                member.status === "active" ? "green" : "red"
                            }
                        >
                            {member.status}
                        </Badge>
                    </Td> */}
							<Td>
								<Text color="muted">{member.email}</Text>
							</Td>
							<Td>
								<Text color="muted">{member.role}</Text>
							</Td>
							<Td>
								<Text color="muted">{member.department}</Text>
							</Td>
							<Td>
								<Text color="muted">
									{member.annualSalary &&
										userCurrency(member.bankDetails.currency).format(
											member.annualSalary,
										)}
								</Text>
							</Td>
							{/* <Td>
                        <Text color="muted">
                            <Rating defaultValue={member.rating} size="xl" />
                        </Text>
                    </Td> */}
							{props.isEditable && (
								<Td>
									<HStack spacing="1">
										{/* <IconButton
                                icon={<FiTrash2 fontSize="1.25rem" />}
                                variant="ghost"
                                aria-label="Delete member"
                            /> */}
										<IconButton
											onClick={() => openModal(member)}
											icon={<FiEdit2 fontSize="1.25rem" />}
											variant="ghost"
											aria-label="Edit member"
										/>
									</HStack>
								</Td>
							)}
						</Tr>
					))}
				</Tbody>
			</Table>
			{record && (
				<Modal size="2xl" isCentered isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Edit Employee</ModalHeader>
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
