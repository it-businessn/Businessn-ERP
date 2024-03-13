import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";

const SearchFilter = ({ width }) => {
	return (
		<>
			<Button
				w={width ? width : "auto"}
				color={"brand.nav_color"}
				leftIcon={<MdOutlineFilterList />}
				border={"2px solid var(--filter_border_color)"}
				borderRadius={"10px"}
				variant={"ghost"}
				_hover={{ color: "brand.600", bg: "transparent" }}
			>
				Filter
			</Button>
			<InputGroup
				borderRadius={"10px"}
				border={"1px solid var(--filter_border_color)"}
				fontWeight="bold"
			>
				<InputLeftElement size="xs" children={<FaSearch />} />
				<Input
					_placeholder={{
						color: "brand.nav_color",
					}}
					color={"brand.nav_color"}
					bg={"brand.primary_bg"}
					type="text"
					placeholder="Search here"
				/>
			</InputGroup>
		</>
	);
};

export default SearchFilter;
