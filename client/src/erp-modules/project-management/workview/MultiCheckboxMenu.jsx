import {
	Checkbox,
	CloseButton,
	Flex,
	Menu,
	MenuItem,
	MenuList,
	Stack,
	useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { PROJECT_ASSIGNEES } from "./data";

const MultiCheckboxMenu = ({ openMenu, handleCloseMenu }) => {
	const [selectedOptions, setSelectedOptions] = useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleCheckboxChange = (value) => {
		if (selectedOptions.includes(value)) {
			setSelectedOptions(selectedOptions.filter((option) => option !== value));
		} else {
			setSelectedOptions([...selectedOptions, value]);
		}
	};

	const handleClose = (e) => {
		e.preventDefault();
		handleCloseMenu(selectedOptions);
		onClose();
	};

	return (
		<Menu isOpen={isOpen || openMenu} onClose={onClose}>
			<MenuList>
				<MenuItem
					as={Flex}
					p={0}
					justify="end"
					color={"var(--main_color_black)"}
					_hover={{ cursor: "default" }}
				>
					<CloseButton onClick={handleClose} />
				</MenuItem>
				<Stack spacing={2}>
					{PROJECT_ASSIGNEES.map((assignee) => (
						<MenuItem key={assignee.id}>
							<Checkbox
								colorScheme="facebook"
								isChecked={selectedOptions.includes(assignee.name)}
								onChange={() => handleCheckboxChange(assignee.name)}
							>
								{assignee.name}
							</Checkbox>
						</MenuItem>
					))}
				</Stack>
			</MenuList>
		</Menu>
	);
};

export default MultiCheckboxMenu;
