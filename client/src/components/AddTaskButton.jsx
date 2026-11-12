import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import { Button, HStack } from "@chakra-ui/react";
import { COLORS } from "erp-modules/project-management/workview/project/data";
import { CgNotes } from "react-icons/cg";
import { generateLighterShade } from "utils";

export const AddTaskButton = ({ handleAdd, handleEdit, isInner, onNoteIconClick, isFile }) => {
	return (
		<HStack spacing={isFile ? 0 : 1}>
			{!isInner && (
				<>
					<Button
						onClick={handleAdd}
						aria-label="Add item"
						size={isFile ? "xs" : "xxs"}
						display={"flex"}
						variant="solid"
						p={isFile ? 0 : "3px"}
						bg="var(--lead_cards_bg)"
						fontWeight={"bold"}
						color="var(--primary_button_bg)"
						border={`1px solid ${generateLighterShade(COLORS.primary, 0.5)}`}
						_hover={{
							bg: generateLighterShade(COLORS.primary, 0.8),
							color: "var(--nav_color)",
						}}
					>
						<AddIcon />
					</Button>
					<Button
						onClick={onNoteIconClick}
						aria-label="Notes"
						minW={"unset"}
						display={"flex"}
						variant="ghost"
						fontWeight={"bold"}
						color="var(--nav_color)"
						_hover={"unset"}
						size={isFile ? "sm" : "xxs"}
					>
						<CgNotes fontSize={isFile && "1.5em"} />
					</Button>
				</>
			)}

			<Button
				onClick={handleEdit}
				aria-label="Edit"
				padding={!isFile && 0}
				minW={"unset"}
				display={"flex"}
				variant="ghost"
				fontWeight={"bold"}
				color="var(--nav_color)"
				ml={isFile && -5}
				_hover={"unset"}
				size={isFile ? "sm" : "xxs"}
			>
				<SettingsIcon fontSize={isFile && "1.5em"} />
			</Button>
		</HStack>
	);
};
