import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const SearchFilter = () => {
	return (
		<>
			{/* <LeftIconButton
				color={"var(--nav_color)"}
				border={"2px solid var(--filter_border_color)"}
				name={"Filter"}
				borderRadius={"10px"}
				variant={"ghost"}
				isFilter
				size="xs"
				ml={2}
				// handleClick={() => setShowDateFilter(true)}
				icon={<MdOutlineFilterList />}
			/> */}
			<InputGroup
				size="xs"
				w={"40%"}
				borderRadius={"10px"}
				border={"1px solid var(--filter_border_color)"}
				fontSize="xs"
				fontWeight="bold"
			>
				<InputLeftElement size="xs" children={<FaSearch />} />
				<Input
					size="xs"
					_placeholder={{
						color: "var(--nav_color)",
						fontSize: "xs",
					}}
					color={"var(--nav_color)"}
					bg={"var(--primary_bg)"}
					type="text"
					placeholder="Search by employee name or department or cost center"
					pr="4.5rem"
					py={"1.1em"}
				/>
			</InputGroup>
		</>
	);
};

export default SearchFilter;
