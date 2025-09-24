import { SmallCloseIcon } from "@chakra-ui/icons";
import { Avatar, Button, FormControl, FormLabel, Select } from "@chakra-ui/react";
import RequiredLabel from "components/ui/form/RequiredLabel";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const AssigneeSelector = ({
	assignees,
	selectedAssignees,
	onAssigneeChange,
	onRemoveAssignee,
	label,
	name,
	setAssigneeError,
	assigneeError,
	isDisabled,
	setIsDisabled,
	required,
}) => {
	const [selectedValue, setSelectedValue] = useState("");

	const handleMultiAssigneesChange = (e) => {
		if (e.target.value) {
			const selectedAssignee = { name: e.target.value };

			if (
				selectedAssignees?.length === 0 ||
				!selectedAssignees.some((assignee) => assignee.name === selectedAssignee.name)
			) {
				onAssigneeChange((prevAssignees) => [...prevAssignees, selectedAssignee]);
				if (assigneeError) {
					setAssigneeError(null);
				}
				if (isDisabled) {
					setIsDisabled(false);
				}
			}
			setSelectedValue(selectedAssignee.name);
		}
	};

	const handleRemoveAssignee = (assigneeToRemove) => {
		onRemoveAssignee((prevAssignees) =>
			prevAssignees.filter((assignee) => assignee.name !== assigneeToRemove.name),
		);

		const defaultVal = selectedAssignees?.length > 1 ? selectedAssignees?.[0].name : "";
		setSelectedValue(defaultVal);
	};

	return (
		<FormControl>
			<RequiredLabel label={label} required={required} />
			<Select
				icon={<FaCaretDown />}
				borderRadius="10px"
				size="sm"
				name={name}
				value={selectedValue}
				onChange={handleMultiAssigneesChange}
				placeholder={`Select ${label}`}
			>
				{assignees?.map((assignee) => (
					<option
						value={assignee?.fullName || assignee?.name}
						key={assignee?._id || assignee?.name}
					>
						{assignee?.fullName || assignee?.name}
					</option>
				))}
			</Select>

			{selectedAssignees?.length > 0 && (
				<FormControl>
					<FormLabel>Selected {label}</FormLabel>
					{selectedAssignees?.map((assignee) => (
						<Button
							key={assignee.name}
							ml="2"
							size="sm"
							variant="ghost"
							color="teal.500"
							rightIcon={<SmallCloseIcon />}
							onClick={() => handleRemoveAssignee(assignee)}
						>
							<Avatar name={assignee.name} src={assignee.avatarUrl} />
							{assignee.name}
						</Button>
					))}
				</FormControl>
			)}
		</FormControl>
	);
};

export default AssigneeSelector;
