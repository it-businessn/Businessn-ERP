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
import ActionButtonGroup from "../ActionButtonGroup";

const PayrollMultiSelectBox = ({
	openMenu,
	handleCloseMenu,
	selectedOptions,
	setSelectedOptions,
	data,
	w,
	handleApply,
}) => {
	const { onClose } = useDisclosure();

	const handleCheckboxChange = (value) => {
		if (selectedOptions.includes(value)) {
			setSelectedOptions(selectedOptions.filter((option) => option !== value));
		} else {
			setSelectedOptions([...selectedOptions, value]);
		}
	};

	const handleClose = () => {
		handleCloseMenu();
	};

	const handleClearAll = (e) => {
		e.preventDefault();
		setSelectedOptions([]);
	};

	const onApply = () => {
		handleApply(selectedOptions);
	};

	return (
		<Menu isOpen={openMenu} onClose={onClose}>
			<MenuList>
				<MenuItem
					as={Flex}
					p={0}
					justify="end"
					color={"var(--main_color_black)"}
					_hover={{ cursor: "default" }}
				>
					<ActionButtonGroup
						submitBtnName={"Apply"}
						closeLabel="Clear all"
						onClose={handleClearAll}
						onOpen={onApply}
						size="sm"
					/>
					<CloseButton onClick={handleClose} position={"sticky"} top={0} />
				</MenuItem>
				<Stack spacing={1} overflow={"auto"} maxHeight={"33vh"} w={w}>
					{data?.map((assignee) => (
						<MenuItem key={assignee?._id ?? assignee}>
							<Checkbox
								colorScheme="facebook"
								isChecked={selectedOptions?.includes(
									assignee.fullName ?? (assignee.name || assignee),
								)}
								onChange={() =>
									handleCheckboxChange(assignee.fullName ?? assignee.name)
								}
							>
								{assignee.fullName ?? assignee.name}
							</Checkbox>
						</MenuItem>
					))}
				</Stack>
			</MenuList>
		</Menu>
	);
};

export default PayrollMultiSelectBox;
