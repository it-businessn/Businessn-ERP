import { Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import TicketService from "services/TicketService";

const NewTicket = ({
	showAddEntry,
	setShowAddEntry,
	setRefresh,
	company,
	userId,
	employees,
	depts,
}) => {
	const PRIORITY_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const [isSubmitting, setIsSubmitting] = useState(false);

	const initialFormData = {
		category: "",
		priority: 0,
		companyName: company,
		assignee: "",
		topic: "",
		issue: "",
		originator: userId,
		file: null,
	};

	const [formData, setFormData] = useState(initialFormData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleFileChange = (e) => {
		setFormData((prevData) => ({ ...prevData, file: e.target.files[0] }));
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
		const { category, priority, companyName, assignee, topic, issue, originator, file } = formData;
		const ticketData = new FormData();
		ticketData.append("category", category);
		ticketData.append("companyName", companyName);
		ticketData.append("assignee", assignee);
		ticketData.append("priority", priority);
		ticketData.append("topic", topic);
		ticketData.append("issue", issue);
		ticketData.append("originator", originator);
		ticketData.append("file", file);

		setIsSubmitting(true);
		try {
			await TicketService.addInfo(ticketData);
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
					valueParam="name"
					name="category"
					label="Category"
					valueText={formData?.category}
					handleChange={handleChange}
					options={depts}
					placeholder="Select category"
				/>
				<SelectFormControl
					name="priority"
					label="Priority"
					valueText={formData?.priority}
					handleChange={handleChange}
					options={PRIORITY_LIST}
					placeholder="Select priority"
				/>
				<SelectFormControl
					valueParam="fullName"
					name="fullName"
					label="Assignee"
					valueText={formData?.assignee}
					handleChange={(e) =>
						setFormData((prevData) => ({
							...prevData,
							assignee: e.target.value,
						}))
					}
					options={employees}
					placeholder="Select assignee"
				/>
				{/* <FormControl>
					<FormLabel>Assignee</FormLabel>
					<Select
						name="fullName"
						label="Assignee"
						value={formData?.assignee}
						onChange={(e) => {
							setFormData((prevData) => ({
								...prevData,
								assignee: e.target.value,
							}));
						}}
						placeholder="Select assignee"
					>
						{employees?.map((_) => (
							<option key={_.fullName} value={_?.fullName}>
								{_?.fullName}
							</option>
						))}
					</Select>
				</FormControl> */}
				<InputFormControl
					maxLength={100}
					label="Topic"
					name="topic"
					valueText={formData?.topic}
					handleChange={handleChange}
					required
				/>
				<TextAreaFormControl
					maxLength={500}
					label="Description"
					name="issue"
					valueText={formData?.issue}
					handleChange={handleChange}
					required
				/>
				<InputFormControl
					label="File/Attachment"
					name="file"
					type="file"
					handleChange={handleFileChange}
				/>
				<ActionButtonGroup
					submitBtnName={"Add"}
					isDisabled={
						formData?.assignee === "" ||
						formData?.topic === "" ||
						formData?.issue === "" ||
						formData?.category === ""
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
