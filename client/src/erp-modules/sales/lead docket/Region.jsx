import { Icon, Select } from "@chakra-ui/react";
import { REGIONS } from "erp-modules/project-management/workview/project/data";
import { FaCaretDown } from "react-icons/fa";

const Region = () => {
	return (
		<Select
			icon={<Icon as={FaCaretDown} />}
			mt={{ base: "1em", md: 0 }}
			border={"2px solid var(--filter_border_color)"}
			borderRadius={"10px"}
		>
			{REGIONS.map(({ name, id }) => (
				<option key={id} value={name}>
					{name}
				</option>
			))}
		</Select>
	);
};

export default Region;
