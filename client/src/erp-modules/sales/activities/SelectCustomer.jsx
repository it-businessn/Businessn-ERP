import { Select, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import RadioFormControl from "components/ui/form/RadioFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";
import ActivityService from "services/ActivityService";
import LeadsService from "services/LeadsService";
import { today } from "utils/convertDate";

const SelectCustomer = ({
	showSelectCustomer,
	setShowSelectCustomer,
	company,
	contacts,
	leads,
	isDashboard,
	setRefresh,
	user,
	logType,
}) => {
	const [customer, setCustomer] = useState("");
	const [data, setData] = useState(null);
	const [lead, setLead] = useState(null);
	const [isQuickAdd, setIsQuickAdd] = useState(isDashboard);
	const { onClose } = useDisclosure();

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (value) setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const handleLead = (e) => {
		const { value } = e.target;
		if (value) {
			setLead(value);
			if (isQuickAdd) {
				navigate(
					`${ROUTE_PATH.SALES}${ROUTE_PATH.FRESH_LEADS}${ROUTE_PATH.PROFILE}/${value}/${company}`,
				);
			} else {
				navigate(
					`${ROUTE_PATH.SALES}${ROUTE_PATH.CUSTOMERS}${ROUTE_PATH.PROFILE}/${value}/${company}`,
				);
			}
		}
	};
	const handleClose = () => {
		onClose();
		setCustomer(null);
		setShowSelectCustomer(false);
	};
	const handleRadioChange = (value) => {
		setCustomer(value);
		const exists = value === "Existing Contact";
		const result = exists ? contacts : leads;
		setIsQuickAdd(!exists);
		setData(result);
	};
	const initialFormData = {
		abbreviation: "",
		name: "",
		companyName: company,
		email: "",
		opportunityName: "",
		phone: "",
		stage: "L1",
		primaryAssignee: [{ name: user?.fullName }],
	};
	const [formData, setFormData] = useState(initialFormData);

	const [isSubmitting, setSubmitting] = useState(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		formData.abbreviation = `${formData?.name.replace(" ", "_").toUpperCase()}${today}`;
		formData.opportunityName = formData?.abbreviation;

		setSubmitting(true);

		try {
			const result = await LeadsService.createOpportunity(formData);
			await ActivityService.addActivity({
				type: logType,
				email: formData?.email,
				phone: formData?.phone,
				duration: 0,
				description: "",
				linkedInContact: "",
				createdBy: user?._id,
				contactId: result.data._id,
				companyName: company,
			});
			setRefresh((prev) => !prev);
			handleClose();
			setFormData(initialFormData);
			setSubmitting(false);
		} catch (error) {
			console.log(error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<ModalLayout title={"Log activity"} size="sm" isOpen={showSelectCustomer} onClose={handleClose}>
			{!isDashboard && (
				<RadioFormControl
					label={"Select Contact Type"}
					handleChange={handleRadioChange}
					options={[
						{ name: "Quick Add", value: "Quick Add" },
						{ name: "Existing Contact", value: "Existing Contact" },
					]}
					isRequired
				/>
			)}
			{isQuickAdd ? (
				<form onSubmit={handleSubmit}>
					<InputFormControl
						label={"Name of company"}
						name="name"
						valueText={formData?.name}
						handleChange={handleChange}
						required
					/>
					<InputFormControl
						label={"Phone"}
						name="phone"
						valueText={formData?.phone}
						handleChange={handleChange}
						required
					/>
					<InputFormControl
						label={"Email"}
						name="email"
						type="email"
						valueText={formData?.email}
						handleChange={handleChange}
						required
					/>
					<ActionButtonGroup submitBtnName={"Add"} isLoading={isSubmitting} onClose={handleClose} />
				</form>
			) : (
				customer && (
					<Select
						icon={<FaCaretDown />}
						borderRadius="10px"
						size="sm"
						placeholder={data?.length === 0 ? "No contacts found" : "Select existing contact"}
						name="name"
						value={lead || ""}
						onChange={handleLead}
					>
						{data?.map((item) => (
							<option value={item._id} key={item?._id}>
								{item?.leadId?.opportunityName}
							</option>
						))}
					</Select>
				)
			)}
		</ModalLayout>
	);
};

export default SelectCustomer;
