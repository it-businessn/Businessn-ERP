import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormLabel,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Tag,
	Wrap,
	WrapItem,
} from "@chakra-ui/react";
import FormControlMain from "components/ui/form";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useMemo, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const CrewMultiSelectDropdown = ({
	label,
	tag,
	data,
	selectedOptions,
	setSelectedOptions,
	showMultiSelect,
	handleMenuToggle,
	handleCloseMenu,
	param = "name",
	isEmp,
}) => {
	const [search, setSearch] = useState("");
	const isSelected = (item) => selectedOptions.some((opt) => opt[param] === item[param]);
	const toggleOption = (option) => {
		setSelectedOptions((prev) =>
			isSelected(option) ? prev.filter((item) => item[param] !== option[param]) : [...prev, option],
		);
	};

	const filteredData = useMemo(() => {
		const term = search?.toLowerCase();
		return data?.filter((item) => item?.[param]?.toLowerCase().includes(term));
	}, [search, data]);

	const selectAll = () => setSelectedOptions(filteredData);
	const clearAll = () => setSelectedOptions([]);

	return (
		<FormControlMain>
			<FormLabel fontWeight="bold">{label}</FormLabel>

			<Menu isOpen={showMultiSelect} closeOnSelect={false} onClose={handleCloseMenu}>
				<MenuButton
					as={Button}
					bg={"var(--primary_bg)"}
					color={"var(--primary_button_bg)"}
					_hover={{
						bg: "var(--primary_bg)",
						color: "var(--primary_button_bg)",
					}}
					rightIcon={<FaCaretDown />}
					onClick={handleMenuToggle}
				>
					{selectedOptions.length} {tag}
				</MenuButton>

				<MenuList minH="200px" maxH="300px" overflowY="auto" p={2} css={tabScrollCss}>
					{isEmp && (
						<Box pos="fixed" top={0} p={0} zIndex={2} bg={"var(--primary_bg)"}>
							<Input
								placeholder="Search..."
								size="sm"
								mb={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Flex justify="space-between" mb={2}>
								<Button size="xs" variant="ghost" colorScheme="teal" onClick={selectAll}>
									Select All
								</Button>
								<Button size="xs" variant="ghost" colorScheme="red" onClick={clearAll}>
									Clear All
								</Button>
							</Flex>
						</Box>
					)}

					<Box borderTop="1px solid #eee" pt={2} pos={isEmp && "relative"} top={isEmp && "4rem"}>
						{filteredData?.map((item) => (
							<MenuItem key={item._id} closeOnSelect={false} onClick={(e) => e.stopPropagation()}>
								<Checkbox
									colorScheme="facebook"
									isChecked={isSelected(item)}
									onChange={() => toggleOption(item)}
								>
									{item[param]}
								</Checkbox>
							</MenuItem>
						))}

						{filteredData?.length === 0 && (
							<Box px={3} py={2} color="gray.500">
								No results found
							</Box>
						)}
					</Box>
				</MenuList>
			</Menu>

			{!isEmp && selectedOptions.length > 0 && (
				<Wrap mt={2}>
					{selectedOptions?.map((opt) => (
						<WrapItem key={opt._id}>
							<Tag colorScheme="teal">{opt[param]}</Tag>
						</WrapItem>
					))}
				</Wrap>
			)}
		</FormControlMain>
	);
};

export default CrewMultiSelectDropdown;
