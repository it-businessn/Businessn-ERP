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
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import ActionButtonGroup from "../ActionButtonGroup";

const PayrollMultiSelectBox = ({
	openMenu,
	handleCloseMenu,
	selectedOptions,
	setSelectedOptions,
	data,
	w,
	handleApply,
	type,
}) => {
	const { onClose } = useDisclosure();

	// One value per option for both the checked state and toggling. They used to
	// differ (toggle added assignee[type], the check looked for fullName), so an
	// option could be selected while its box stayed unchecked.
	const optionValue = (option) =>
		typeof option === "string"
			? option
			: (type && option?.[type]) ||
				option?.fullName ||
				option?.empId?.fullName ||
				option?.name ||
				"";
	const options = (data || []).filter((option) => optionValue(option));
	const selected = Array.isArray(selectedOptions) ? selectedOptions : [];
	// a selection item matches an option by its value, or (callers that keep the
	// option objects, e.g. the accounting ledger) by the object's `type` field
	const isSelected = (item, option) =>
		item === optionValue(option) ||
		(type &&
			item &&
			typeof item === "object" &&
			item[type] !== undefined &&
			item[type] === option?.[type]);

	const handleCheckboxChange = (option) => {
		if (selected.some((item) => isSelected(item, option))) {
			setSelectedOptions(selected.filter((item) => !isSelected(item, option)));
		} else {
			// keep the caller's form: objects stay objects, names stay names
			const keepsObjects = selected.some((item) => item && typeof item === "object");
			setSelectedOptions([...selected, keepsObjects ? option : optionValue(option)]);
		}
	};

	const handleClose = () => {
		handleCloseMenu();
	};

	const handleClearAll = (e) => {
		e.preventDefault();
		setSelectedOptions([]);
		handleApply([]);
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
				<Stack spacing={1} overflow={"auto"} maxHeight={"33vh"} w={w} css={tabScrollCss}>
					{options.map((assignee) => {
						const value = optionValue(assignee);
						const isChecked = selected.some((item) => isSelected(item, assignee));
						// The whole row toggles; the checkbox only shows the state (see MultiSelectBox).
						return (
							<MenuItem
								key={assignee?._id || assignee?.empId?._id || value}
								closeOnSelect={false}
								onClick={() => handleCheckboxChange(assignee)}
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

export default PayrollMultiSelectBox;
