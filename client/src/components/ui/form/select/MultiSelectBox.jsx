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

const MultiSelectBox = ({
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
					<CloseButton onClick={handleClose} position={"sticky"} top={0} />
				</MenuItem>
				<Stack spacing={1} overflow={"auto"} maxHeight={"33vh"}>
					{data?.map((assignee) => (
						<MenuItem key={assignee?._id || assignee}>
							<Checkbox
								colorScheme="facebook"
								isChecked={selectedOptions?.includes(
									assignee.fullName || assignee.name,
								)}
								onChange={() =>
									handleCheckboxChange(assignee.fullName || assignee.name)
								}
							>
								{assignee.fullName || assignee.name}
							</Checkbox>
						</MenuItem>
					))}
				</Stack>
			</MenuList>
		</Menu>
	);
};

export default MultiSelectBox;
