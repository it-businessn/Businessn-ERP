import {
	HStack,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Stack,
} from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";

const OtherFilter = ({
	showOtherFilter,
	toggleOtherFilter,
	handleFilter,
	data,
	filteredData,
	setFilteredData,
	helperText,
}) => {
	const [openAssigneeMenu, setOpenAssigneeMenu] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const handleMenuToggle = () => {
		setOpenAssigneeMenu((prev) => !prev);
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenAssigneeMenu(false);
		setFilteredData(selectedOptions);
	};
	const handleClose = () => {
		toggleOtherFilter("false");
		setSelectedOptions([]);
		setFilteredData([]);
	};
	return (
		<Popover
			isOpen={showOtherFilter}
			onClose={toggleOtherFilter}
			overflow="auto"
		>
			<PopoverTrigger>
				<HStack
					cursor="pointer"
					borderRadius="md"
					onClick={toggleOtherFilter}
					p={0}
					spacing={1}
				>
					<MdOutlineFilterList />
					<OutlineButton
						borderColor={!filteredData?.length && "var(--filter_border_color)"}
						label={
							<>
								{filteredData?.length ?? 0} {helperText}(s) selected
								<FaCaretDown />
							</>
						}
						size="sm"
					/>
				</HStack>
			</PopoverTrigger>
			<PopoverContent minH={"40vh"} overflow={"auto"}>
				<PopoverBody>
					{showOtherFilter && (
						<Stack spacing={3} justifyContent={"end"}>
							<MultiSelectFormControl
								w={"15vw"}
								label={`Select ${helperText}`}
								tag={"employee(s)"}
								showMultiSelect={openAssigneeMenu}
								visibility="visible"
								data={data}
								handleCloseMenu={handleCloseMenu}
								selectedOptions={selectedOptions}
								setSelectedOptions={setSelectedOptions}
								handleMenuToggle={handleMenuToggle}
								list={filteredData}
								hideAvatar
							/>
							<ActionButtonGroup
								size="xs"
								submitBtnName={"Apply"}
								closeLabel={"Clear"}
								onClose={handleClose}
								onOpen={handleFilter}
							/>
						</Stack>
					)}
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default OtherFilter;
