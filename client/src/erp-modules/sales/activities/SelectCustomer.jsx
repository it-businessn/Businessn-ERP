import {
	Alert,
	AlertIcon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Select,
	useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SelectCustomer = ({
	showSelectCustomer,
	setShowSelectCustomer,
	setRefresh,
	contacts,
}) => {
	const [error, setError] = useState(false);
	const [customer, setCustomer] = useState("");
	const { onClose } = useDisclosure();

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { value } = e.target;
		setCustomer(value);
		navigate(`/sales/customers/profile/${value}`);
	};
	const handleClose = () => {
		onClose();
		setShowSelectCustomer(false);
	};
	return (
		<Modal
			isCentered
			size={"md"}
			isOpen={showSelectCustomer}
			onClose={handleClose}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Select a contact</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Select
						icon={<FaCaretDown />}
						borderRadius="10px"
						size="sm"
						placeholder="Select "
						name="name"
						value={customer}
						onChange={handleChange}
					>
						{contacts?.map(({ _id, leadId }) => (
							<option value={_id} key={_id}>
								{leadId.opportunityName}
							</option>
						))}
					</Select>

					{error && (
						<Alert status="error" mt={4}>
							<AlertIcon />
							{error}
						</Alert>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default SelectCustomer;
