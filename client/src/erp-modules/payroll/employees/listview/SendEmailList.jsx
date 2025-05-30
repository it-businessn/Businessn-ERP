import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import { useEffect, useState } from "react";
import { BiMailSend } from "react-icons/bi";
import UserService from "services/UserService";

const SendEmailList = ({ company, isOpen, onClose, selectedPayGroupOption }) => {
	const [openMenu, setOpenMenu] = useState(false);
	const [selectedEmp, setSelectedEmp] = useState(null);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [employees, setEmployees] = useState(null);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = await UserService.getPayrollActiveCompanyUsers(
					company,
					null,
					selectedPayGroupOption,
				);
				data.map((emp) => {
					emp.fullName = emp?.empId?.fullName;
					emp._id = emp?.empId?._id;
					return emp;
				});
				setEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedPayGroupOption) fetchAllEmployees();
	}, [selectedPayGroupOption]);

	const handleCloseMenu = (selectedOptions) => {
		setOpenMenu(false);
		setSelectedEmp(selectedOptions);
	};

	const handleMenuToggle = () => {
		setOpenMenu((prev) => !prev);
	};
	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const { data } = await UserService.sendEmailLoginCreds({ employees: selectedOptions });
			setIsLoading(false);
			onClose();
		} catch (error) {}
	};
	return (
		<Modal isCentered isOpen={isOpen} onClose={onClose}>
			<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
			<ModalContent>
				<ModalHeader pb={0}>Send Email to Employee</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<MultiSelectFormControl
						label={"Select Employees"}
						tag={"employee(s) selected"}
						showMultiSelect={openMenu}
						data={employees}
						handleCloseMenu={handleCloseMenu}
						selectedOptions={selectedOptions}
						setSelectedOptions={setSelectedOptions}
						handleMenuToggle={handleMenuToggle}
						list={selectedEmp}
						hideAvatar
					/>
					<ActionButtonGroup
						submitBtnName={"Send"}
						onClose={onClose}
						onOpen={handleSubmit}
						size="sm"
						rightIcon={<BiMailSend />}
						isLoading={isLoading}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default SendEmailList;
