import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useToast,
} from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import { useEffect, useState } from "react";
import { BiMailSend } from "react-icons/bi";
import UserService from "services/UserService";

const SendEmailList = ({ emailType, company, isOpen, onClose, selectedPayGroupOption }) => {
	const [openMenu, setOpenMenu] = useState(false);
	const [selectedEmp, setSelectedEmp] = useState(null);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [isLoading, setIsLoading] = useStsate(false);

	const [employees, setEmployees] = useState(null);
	const isCreds = emailType === "creds";
	const title = isCreds ? "Send Login Credentials" : "Send Paystubs";
	const toast = useToast();

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
			const { data } = isCreds
				? await UserService.sendEmailLoginCreds({ employees: selectedOptions })
				: await UserService.sendEmailPaystubs({ employees: selectedOptions });
			toast({
				title: "Success",
				description: data.message,
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			setIsLoading(false);
			onClose();
		} catch (error) {
			toast({
				title: "Something went wrong.",
				description: "Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};
	return (
		<Modal isCentered isOpen={isOpen} onClose={onClose}>
			<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
			<ModalContent>
				<ModalHeader pb={0}>{title}</ModalHeader>
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
						isDisabled={!selectedOptions?.length}
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
