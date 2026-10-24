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
import { EMAIL_TYPE } from "constant";
import { useEffect, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import UserService from "services/UserService";

const SendEmailList = ({ title, company, isOpen, onClose, selectedPayGroupOption }) => {
	const [openMenu, setOpenMenu] = useState(false);
	const [selectedEmp, setSelectedEmp] = useState(null);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [employees, setEmployees] = useState(null);
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
			const payStubEmail = title.includes(EMAIL_TYPE.PAYSTUB);
			const { data } = payStubEmail
				? await UserService.sendEmailPaystubs({ employees: selectedOptions, companyName: company })
				: await UserService.sendEmailLoginCreds({ employees: selectedOptions, companyName: company });
			// both endpoints list employees they could not e-mail (not found, no pay stub, ...)
			const notFound = data.notFound?.length ? ` Not found: ${data.notFound.join(", ")}.` : "";
			const partial = data.message !== "Email sent successfully" || Boolean(notFound);
			toast({
				title: partial ? "Sent with exceptions" : "Success",
				description:
					data.message !== "Email sent successfully" ? data.message : `${data.message}.${notFound}`,
				status: partial ? "warning" : "success",
				duration: partial ? 8000 : 3000,
				isClosable: true,
			});
			setIsLoading(false);
			onClose();
		} catch (error) {
			setIsLoading(false);
			toast({
				title: "Something went wrong.",
				description: error?.response?.data?.message || "Please try again.",
				status: "error",
				duration: 8000,
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
						rightIcon={<BsFillSendFill />}
						isLoading={isLoading}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default SendEmailList;
