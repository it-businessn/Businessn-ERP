import { Tbody, Td, Tr, useDisclosure } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";

import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import { LEADS_COLS } from "../lead docket/data";
import LeadContacts from "./LeadContacts";

export const totalLeads = (name, isManager, leads, userName) => {
	return isManager
		? leads?.filter((lead) => lead.stage === name).length
		: leads?.filter((lead) => lead.stage === name && lead.primaryAssignee[0]?.name === userName)
				.length;
};

const ListView = ({
	leads,
	setIsUpdated,
	reference,
	company,
	setShowConfirmationPopUp,
	setDeleteRecord,
}) => {
	const loggedInUser = LocalStorageService.getItem("user");
	const defaultLeadInfo = {
		_id: null,
		opportunityName: "",
		email: "",
		stage: "",
		phone: "",
		companyName: company,
	};
	const { fullName, role } = loggedInUser;

	const isUserManager = isManager(role);
	const leadList = isUserManager
		? leads
		: leads?.filter((lead) => lead.primaryAssignee[0]?.name === fullName);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [formData, setFormData] = useState(defaultLeadInfo);
	const [copied, setCopied] = useState(false);

	const handleEdit = (_id, opportunityName, email, phone, stage) => {
		setFormData((prevData) => ({
			...prevData,
			_id,
			opportunityName,
			email,
			phone,
			stage,
		}));
		onOpen();
	};
	const handleCopy = async (_id, opportunityName, email, phone, stage) => {
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};
	const [selectedContact, setSelectedContact] = useState(null);
	const [viewProfile, setViewProfile] = useState(false);
	return (
		<>
			{viewProfile ? (
				<LeadContacts
					setViewProfile={setViewProfile}
					selectedContact={selectedContact}
					company={company}
				/>
			) : (
				<TableLayout cols={LEADS_COLS} height={"73vh"}>
					<Tbody>
						{(!leadList || leadList?.length === 0) && (
							<EmptyRowRecord data={leadList} colSpan={LEADS_COLS?.length} />
						)}
						{leadList?.map((_) => (
							<Tr key={_._id}>
								<Td py={0.5}>
									<NormalTextTitle
										width="250px"
										size="sm"
										whiteSpace="wrap"
										textTransform={"capitalize"}
										title={_.opportunityName}
									/>
								</Td>
								<Td py={0.5}>
									<NormalTextTitle
										width="200px"
										size="sm"
										whiteSpace="wrap"
										textTransform={"capitalize"}
										title={_.name}
									/>
								</Td>
								<Td py={0.5}>{_.email}</Td>
								<Td py={0.5}>
									<FaRegTrashAlt
										cursor={"pointer"}
										onClick={() => {
											setShowConfirmationPopUp(true);
											setDeleteRecord(_._id);
										}}
									/>
								</Td>
								{/* <Td fontSize={"xs"}>
									<HStack>
										<HighlightButton
											name={"See logs"}
											onClick={() => {
												setSelectedContact(_._id);
												setViewProfile((prev) => !prev);
											}}
										/>
									</HStack>
								</Td> */}
							</Tr>
						))}
					</Tbody>
				</TableLayout>
			)}
		</>
	);
};

export default ListView;
