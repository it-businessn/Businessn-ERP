import { Select, useDisclosure } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";

const SelectCustomer = ({
	showSelectCustomer,
	setShowSelectCustomer,
	company,
	contacts,
	leads,
}) => {
	const [customer, setCustomer] = useState(null);
	const [data, setData] = useState(null);
	const [lead, setLead] = useState(null);
	const [isQuickAdd, setIsQuickAdd] = useState(null);
	const { onClose } = useDisclosure();

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { value } = e.target;
		setCustomer(value);
		const exists = value === "Existing Contact";
		const result = exists ? contacts : leads;
		setIsQuickAdd(!exists);
		setData(result);
	};
	const handleLead = (e) => {
		const { value } = e.target;
		setLead(value);
		if (isQuickAdd) {
			navigate(
				`${ROUTE_PATH.SALES}${ROUTE_PATH.FRESH_LEADS}/profile/${value}/${company}`,
			);
		} else {
			navigate(
				`${ROUTE_PATH.SALES}${ROUTE_PATH.CUSTOMERS}/profile/${value}/${company}`,
			);
		}
	};
	const handleClose = () => {
		onClose();
		setCustomer(null);
		setShowSelectCustomer(false);
	};
	return (
		<ModalLayout
			title={"Select a contact"}
			size="md"
			isOpen={showSelectCustomer}
			onClose={handleClose}
		>
			<Select
				icon={<FaCaretDown />}
				borderRadius="10px"
				size="sm"
				placeholder="Select "
				name="name"
				value={customer}
				onChange={handleChange}
			>
				{["Quick Add", "Existing Contact"].map((id) => (
					<option value={id} key={id}>
						{id}
					</option>
				))}
			</Select>
			{customer && (
				<Select
					icon={<FaCaretDown />}
					borderRadius="10px"
					size="sm"
					placeholder={data.length === 0 ? "No contacts found" : "Select lead"}
					name="name"
					value={lead}
					onChange={handleLead}
				>
					{data?.map((item) => (
						<option value={item._id} key={item?._id}>
							{item?.leadId?.opportunityName}
						</option>
					))}
				</Select>
			)}
		</ModalLayout>
	);
};

export default SelectCustomer;
