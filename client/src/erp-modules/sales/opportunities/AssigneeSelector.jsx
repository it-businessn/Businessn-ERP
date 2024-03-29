import { SmallCloseIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Button,
	FormControl,
	FormLabel,
	Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const AssigneeSelector = ({
	assignees,
	selectedAssignees,
	onAssigneeChange,
	onRemoveAssignee,
	label,
	name,
}) => {
	const [selectedValue, setSelectedValue] = useState("");
	const handleMultiAssigneesChange = (event) => {
		if (event.target.value === "") {
			return;
		}

		const selectedAssignee = { name: event.target.value };

		if (
			selectedAssignees.length === 0 ||
			!selectedAssignees.some(
				(assignee) => assignee.name === selectedAssignee.name,
			)
		) {
			onAssigneeChange((prevAssignees) => [...prevAssignees, selectedAssignee]);
		}
		setSelectedValue(selectedAssignee.name);
	};

	const handleRemoveAssignee = (assigneeToRemove) => {
		onRemoveAssignee((prevAssignees) =>
			prevAssignees.filter(
				(assignee) => assignee.name !== assigneeToRemove.name,
			),
		);

		const defaultVal =
			selectedAssignees.length > 1 ? selectedAssignees[0].name : "";
		setSelectedValue(defaultVal);
	};

	return (
		<FormControl>
			<FormLabel>{label}</FormLabel>
			<Select
				icon={<FaCaretDown />}
				borderRadius="10px"
				size="sm"
				name={name}
				value={selectedValue}
				onChange={handleMultiAssigneesChange}
				placeholder={`Select ${label}`}
			>
				{assignees.map(({ name }) => (
					<option value={name} key={name}>
						{name}
					</option>
				))}
			</Select>

			{selectedAssignees.length > 0 && (
				<FormControl>
					<FormLabel>Selected {label}</FormLabel>
					{selectedAssignees.map((assignee) => (
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
