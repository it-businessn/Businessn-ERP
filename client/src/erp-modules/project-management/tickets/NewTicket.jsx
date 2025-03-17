import { Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import TicketService from "services/TicketService";

const NewTicket = ({ showAddEntry, setShowAddEntry, setRefresh, company, userId, employees }) => {
	const CATEGORY_LIST = [
		{ category: "Onboarding" },
		{ category: "Development" },
		{ category: "Sales" },
		{ category: "Marketing" },
		{ category: "Service Delivery" },
		{ category: "IT Support" },
		{ category: "Finance" },
		{ category: "Testing" },
		{ category: "Support" },
		{ category: "AI" },
	];

	const PRIORITY_LIST = [
		{ priority: 0 },
		{ priority: 1 },
		{ priority: 2 },
		{ priority: 3 },
		{ priority: 4 },
		{ priority: 5 },
		{ priority: 6 },
		{ priority: 7 },
		{ priority: 8 },
		{ priority: 9 },
		{ priority: 10 },
	];
	const [isSubmitting, setIsSubmitting] = useState(false);

	const initialFormData = {
		category: "",
		priority: 0,
		companyName: company,
		assignee: "",
		topic: "",
		issue: "",
		originator: userId,
	};

	const [formData, setFormData] = useState(initialFormData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		reset();
	};

	const reset = () => {
		setShowAddEntry(false);
		setFormData(initialFormData);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await TicketService.addInfo(formData);
			setRefresh((prev) => !prev);
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<ModalLayout title={"New ticket"} size="lg" isOpen={showAddEntry} onClose={handleClose}>
			<Stack spacing={3}>
				<SelectFormControl
					valueParam="category"
					name="category"
					label="Category"
					valueText={formData.category}
					handleChange={handleChange}
					options={CATEGORY_LIST}
					placeholder="Select category"
				/>
				<SelectFormControl
					valueParam="priority"
					name="priority"
					label="Priority"
					valueText={formData.priority}
					handleChange={handleChange}
					options={PRIORITY_LIST}
					placeholder="Select priority"
				/>
				<SelectFormControl
					valueParam="fullName"
					name="fullName"
					label="Assignee"
					valueText={formData.assignee}
					handleChange={(e) =>
						setFormData((prevData) => ({
							...prevData,
							assignee: e.target.value,
						}))
					}
					options={employees}
					placeholder="Select assignee"
				/>
				<InputFormControl
					maxLength={100}
					label="Topic"
					name="topic"
					valueText={formData.topic}
					handleChange={handleChange}
					required
				/>
				<TextAreaFormControl
					maxLength={500}
					label="Description"
					name="issue"
					valueText={formData.issue}
					handleChange={handleChange}
					required
				/>

				<ActionButtonGroup
					submitBtnName={"Add"}
					isDisabled={
						formData.assignee === "" ||
						formData.topic === "" ||
						formData.issue === "" ||
						formData.category === ""
					}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default NewTicket;
