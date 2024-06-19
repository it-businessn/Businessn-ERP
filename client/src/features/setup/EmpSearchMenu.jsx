import {
	Input,
	InputGroup,
	InputRightElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const EmpSearchMenu = ({
	filteredEmployees,
	empName,
	handleInputChange,
	handleSelect,
}) => {
	return (
		<Menu>
			<MenuButton>
				<InputGroup
					borderRadius={"10px"}
					border={"1px solid var(--filter_border_color)"}
					fontSize="xs"
					fontWeight="bold"
					size="xs"
				>
					<Input
						_placeholder={{
							color: "brand.nav_color",
							fontSize: "sm",
						}}
						size="xs"
						name="empName"
						value={empName}
						color={"brand.nav_color"}
						bg={"brand.primary_bg"}
						type="text"
						placeholder="Search employee"
						pr="4.5rem"
						py={"1.1em"}
					/>
					<InputRightElement size="xs" children={<FaSearch />} />
				</InputGroup>
			</MenuButton>
			<MenuList height="45vh" overflowY={"auto"}>
				<Input
					size="xs"
					placeholder="Enter Manager Name"
					value={empName}
					onChange={(e) => handleInputChange(e.target.value)}
					mb={2}
				/>
				{filteredEmployees?.map((emp) => (
					<MenuItem key={emp._id} onClick={() => handleSelect(emp)}>
						<Text fontSize="xs">{emp.fullName}</Text>
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
};

export default EmpSearchMenu;
