import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";

const SearchFilter = ({
	width,
	hideFilter,
	w = "100%",
	placeholder = "Search here",
}) => {
	return (
		<>
			{!hideFilter && (
				<Button
					w={width ? width : "auto"}
					color={"var(--nav_color)"}
					leftIcon={<MdOutlineFilterList />}
					border={"2px solid var(--filter_border_color)"}
					borderRadius={"10px"}
					size="xs"
					variant={"ghost"}
					_hover={{ color: "var(--main_color_black)", bg: "transparent" }}
				>
					Filter
				</Button>
			)}
			<InputGroup
				w={w}
				borderRadius={"10px"}
				border={"1px solid var(--filter_border_color)"}
				fontWeight="bold"
				size="xs"
			>
				<InputLeftElement size="xs" children={<FaSearch />} />
				<Input
					_placeholder={{
						color: "var(--nav_color)",
					}}
					color={"var(--nav_color)"}
					bg={"var(--primary_bg)"}
					type="text"
					placeholder={placeholder}
					py={"1.1em"}
				/>
			</InputGroup>
		</>
	);
};

export default SearchFilter;
