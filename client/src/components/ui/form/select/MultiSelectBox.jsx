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
	height,
	w,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	// One value per option, used both for the checked state and for toggling.
	// (They used to differ: string options were toggled as `undefined`, so the
	// selection changed but the box never showed as checked.)
	// Rows without a name (e.g. a deleted employee) are left out: rendering the
	// row object itself would crash React and send the object to the server.
	const optionValue = (option) =>
		typeof option === "string" ? option : option?.fullName || option?.name || "";
	const options = (data || []).filter((option) => optionValue(option));
	// some screens pass a non-list while loading (e.g. a company name string)
	const selected = Array.isArray(selectedOptions) ? selectedOptions : [];

	const handleCheckboxChange = (value) => {
		if (selected.includes(value)) {
			setSelectedOptions(selected.filter((option) => option !== value));
		} else {
			setSelectedOptions([...selected, value]);
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
				<Stack spacing={1} overflow={"auto"} height={height} maxHeight={"33vh"} w={w}>
					{options.map((assignee) => {
						const value = optionValue(assignee);
						const isChecked = selected.includes(value);
						// The whole row toggles; the checkbox only shows the state. A clickable
						// checkbox inside the menu item (a <button>) is invalid HTML and some
						// browsers send the click to the button instead of the checkbox.
						return (
							<MenuItem
								key={assignee?._id ?? value}
								closeOnSelect={false}
								onClick={() => handleCheckboxChange(value)}
							>
								<Checkbox
									colorScheme="facebook"
									isChecked={isChecked}
									pointerEvents="none"
									tabIndex={-1}
								>
									{value}
								</Checkbox>
							</MenuItem>
						);
					})}
				</Stack>
			</MenuList>
		</Menu>
	);
};

export default MultiSelectBox;
