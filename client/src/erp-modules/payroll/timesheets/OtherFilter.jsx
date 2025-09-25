import {
	HStack,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Stack,
} from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PayrollMultiSelectBox from "components/ui/form/select/PayrollMultiSelectBox";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { tabScrollCss } from "../onboard-user/customInfo";

const OtherFilter = ({
	showOtherFilter,
	toggleOtherFilter,
	handleFilter,
	data,
	filteredData,
	setFilteredData,
	helperText,
	type,
}) => {
	const [openMenu, setOpenMenu] = useState(true);
	const [selectedOptions, setSelectedOptions] = useState([]);

	useEffect(() => {
		setSelectedOptions(filteredData);
	}, [filteredData]);

	const handleApply = (options) => {
		setFilteredData(options);
	};

	const handleCloseMenu = () => {
		toggleOtherFilter();
	};

	return (
		<Popover isOpen={showOtherFilter} overflow="auto" css={tabScrollCss}>
			<PopoverTrigger>
				<HStack cursor="pointer" borderRadius="md" onClick={toggleOtherFilter} p={0} spacing={1}>
					<MdOutlineFilterList />
					<OutlineButton
						borderColor={!selectedOptions?.length && "var(--filter_border_color)"}
						label={
							<>
								{selectedOptions?.length || 0} {helperText}(s) selected
								<FaCaretDown />
							</>
						}
						size="sm"
					/>
				</HStack>
			</PopoverTrigger>
			<PopoverContent minH={"40vh"} overflow={"auto"} css={tabScrollCss}>
				<PopoverBody>
					{showOtherFilter && (
						<Stack spacing={3} justifyContent={"end"}>
							<PayrollMultiSelectBox
								w="15vw"
								data={data}
								openMenu={openMenu}
								handleCloseMenu={handleCloseMenu}
								handleApply={handleApply}
								selectedOptions={selectedOptions}
								setSelectedOptions={setSelectedOptions}
								type={type}
							/>
						</Stack>
					)}
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default OtherFilter;
