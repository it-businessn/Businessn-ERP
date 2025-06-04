import { Divider, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdLogout, MdOutlineChevronRight } from "react-icons/md";
import { RiLoginBoxLine } from "react-icons/ri";
import { PAYGROUP_ACTIONS } from "../data";

const PayrollActions = ({ handleClick, actions = PAYGROUP_ACTIONS, title = "Payroll actions" }) => {
	// Map of action keys to their corresponding icons
	const actionIcons = {
		terminate: MdLogout,
		form: IoDocumentTextOutline,
		extra: RiLoginBoxLine,
	};

	return (
		<BoxCard>
			<VStack spacing={0.5} align="stretch">
				<TextTitle size="lg" title={title} />
				<Divider />
				<VStack spacing={0.5} align="stretch">
					{actions?.map(({ key, name }) => (
						<Flex
							key={key}
							p={3}
							cursor="pointer"
							borderRadius="md"
							justify="space-between"
							align="center"
							transition="all 0.2s"
							_hover={{
								bg: "var(--primary_bg)",
								transform: "translateX(4px)",
							}}
							onClick={() => handleClick(key)}
						>
							<Flex align="center" gap={2}>
								{actionIcons[key] && (
									<Icon as={actionIcons[key]} boxSize={5} color="var(--nav_color)" />
								)}
								<Text fontSize="sm" fontWeight="medium" color="var(--nav_color)">
									{name}
								</Text>
							</Flex>
							<Icon
								as={MdOutlineChevronRight}
								boxSize={5}
								color="var(--primary_button_bg)"
								transition="transform 0.2s"
								_groupHover={{
									transform: "translateX(4px)",
								}}
							/>
						</Flex>
					))}
				</VStack>
			</VStack>
		</BoxCard>
	);
};

export default PayrollActions;
