import {
	FormLabel,
	HStack,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Stack,
} from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";

const OtherFilter = ({ showOtherFilter, toggleOtherFilter }) => {
	const [openAssigneeMenu, setOpenAssigneeMenu] = useState(false);
	const handleMenuToggle = () => {
		setOpenAssigneeMenu((prev) => !prev);
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenAssigneeMenu(false);
		// setFormData((prevTask) => ({
		// 	...prevTask,
		// 	meetingAttendees: selectedOptions,
		// }));
	};
	const [selectedOptions, setSelectedOptions] = useState([]);
	return (
		<Popover isOpen={showOtherFilter} onClose={toggleOtherFilter}>
			<PopoverTrigger>
				<Stack
					w={"20%"}
					cursor="pointer"
					borderRadius="md"
					onClick={toggleOtherFilter}
					bg={"var(--main_color)"}
					p={0}
				>
					<HStack justify={"space-between"}>
						<HStack>
							<FormLabel>{"label"}</FormLabel>
							<FaCaretDown />
						</HStack>
						<HStack>
							<FormLabel>{"label"}</FormLabel>
							<FaCaretDown />
						</HStack>
						<HStack>
							<FormLabel>{"label"}</FormLabel>
							<FaCaretDown />
						</HStack>
					</HStack>
				</Stack>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverBody>
					<MultiSelectFormControl
						label={"Select Employee name"}
						tag={"attendee(s)"}
						showMultiSelect={openAssigneeMenu}
						visibility="visible"
						data={["groupMembers"]}
						handleCloseMenu={handleCloseMenu}
						selectedOptions={selectedOptions}
						setSelectedOptions={setSelectedOptions}
						handleMenuToggle={handleMenuToggle}
						list={["meetingAttendees"]}
						hideAvatar
					/>

					<MultiSelectFormControl
						label={"Select Department"}
						visibility="visible"
						tag={"attendee(s)"}
						showMultiSelect={openAssigneeMenu}
						data={["groupMembers"]}
						handleCloseMenu={handleCloseMenu}
						selectedOptions={selectedOptions}
						setSelectedOptions={setSelectedOptions}
						handleMenuToggle={handleMenuToggle}
						list={["meetingAttendees"]}
						hideAvatar
					/>
					<MultiSelectFormControl
						label={"Select Cost center"}
						visibility="visible"
						tag={"attendee(s)"}
						showMultiSelect={openAssigneeMenu}
						data={["groupMembers"]}
						handleCloseMenu={handleCloseMenu}
						selectedOptions={selectedOptions}
						setSelectedOptions={setSelectedOptions}
						handleMenuToggle={handleMenuToggle}
						list={["meetingAttendees"]}
						hideAvatar
					/>
					<ActionButtonGroup
						size="xs"
						submitBtnName={
							<LeftIconButton
								name={"Apply"}
								variant={"ghost"}
								size="xs"
								px={0}
								icon={<MdOutlineFilterList />}
							/>
						}
						// onClose={handleClose}
						// onOpen={handleFilter}
					/>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default OtherFilter;
