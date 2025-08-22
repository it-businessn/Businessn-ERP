import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import { Button, HStack } from "@chakra-ui/react";
import AddNotes from "erp-modules/project-management/workview/cell/AddNotes";
import { COLORS } from "erp-modules/project-management/workview/project/data";
import { useState } from "react";
import { CgNotes } from "react-icons/cg";
import { generateLighterShade } from "utils";

export const AddTaskButton = ({
	onClick,
	handleClick,
	isInner,
	data,
	type,
	setRefresh,
	isFile,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<HStack spacing={isFile ? 0 : 1}>
				{!isInner && (
					<>
						<Button
							onClick={onClick}
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
							onClick={() => setIsOpen(true)}
							size={isFile ? "sm" : "xxs"}
							display={"flex"}
							variant="ghost"
							fontWeight={"bold"}
							color="var(--nav_color)"
							_hover={"unset"}
						>
							<CgNotes size={isFile && "1.5em"} />
						</Button>
					</>
				)}

				<Button
					onClick={handleClick}
					size={isFile ? "md" : "xxs"}
					display={"flex"}
					variant="ghost"
					fontWeight={"bold"}
					color="var(--nav_color)"
					ml={isFile && -5}
					_hover={"unset"}
				>
					<SettingsIcon size={isFile && "2em"} />
				</Button>
			</HStack>
			{isOpen && (
				<AddNotes
					type={type}
					data={data}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					setRefresh={setRefresh}
				/>
			)}
		</>
	);
};
