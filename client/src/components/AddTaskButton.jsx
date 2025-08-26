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
							padding={!isFile && 0}
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
							<AddIcon onClick={onClick} />
						</Button>
						<Button
							padding={!isFile && 0}
							minW={"unset"}
							display={"flex"}
							variant="ghost"
							fontWeight={"bold"}
							color="var(--nav_color)"
							_hover={"unset"}
						>
							<CgNotes onClick={() => setIsOpen(true)} fontSize={isFile && "1.5em"} />
						</Button>
					</>
				)}

				<Button
					padding={!isFile && 0}
					minW={"unset"}
					display={"flex"}
					variant="ghost"
					fontWeight={"bold"}
					color="var(--nav_color)"
					ml={isFile && -5}
					_hover={"unset"}
				>
					<SettingsIcon onClick={handleClick} fontSize={isFile ? "1.5em" : "xxs"} />
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
