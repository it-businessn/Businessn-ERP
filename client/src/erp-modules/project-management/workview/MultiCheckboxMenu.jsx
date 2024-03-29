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

const MultiCheckboxMenu = ({
	openMenu,
	handleCloseMenu,
	selectedOptions,
	setSelectedOptions,
	data,
}) => {
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
					{data.map((assignee) => (
						<MenuItem key={assignee._id}>
							<Checkbox
								colorScheme="facebook"
								isChecked={selectedOptions.includes(assignee.fullName)}
								onChange={() => handleCheckboxChange(assignee.fullName)}
							>
								{assignee.fullName}
							</Checkbox>
						</MenuItem>
					))}
				</Stack>
			</MenuList>
		</Menu>
	);
};

export default MultiCheckboxMenu;
