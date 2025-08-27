import { Button, Icon } from "@chakra-ui/react";
import { COLORS } from "erp-modules/project-management/workview/project/data";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GoTasklist } from "react-icons/go";
import { generateLighterShade } from "utils";

export const TaskDropdown = ({ totalTasks, onClick, isExpanded, type, isFile }) => {
	const TASK_TYPE = {
		file: "P",
		project: "T",
		task: "S",
	};
	return (
		<Button
			onClick={onClick}
			size={isFile ? "xs" : "xxs"}
			p={"2px"}
			fontSize={"12px"}
			color={"var(--primary_button_bg)"}
			border={`1px solid ${generateLighterShade(COLORS.primary, 0.5)}`}
			bg={generateLighterShade(COLORS.primary, 0.8)}
			leftIcon={<Icon as={GoTasklist} sx={{ marginRight: "-4px", fontsize: "10px" }} />}
			rightIcon={
				<Icon
					as={isExpanded ? FaChevronUp : FaChevronDown}
					sx={{ marginLeft: "-4px", fontsize: "10px" }}
				/>
			}
			_hover={{
				bg: generateLighterShade(COLORS.primary, 0.8),
				color: "var(--primary_button_bg)",
			}}
		>
			{`${totalTasks} ${TASK_TYPE[type] || "S"}`}
		</Button>
	);
};
