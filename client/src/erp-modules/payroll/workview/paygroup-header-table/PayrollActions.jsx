import { Divider, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { MdOutlineChevronRight } from "react-icons/md";

const PayrollActions = ({ handleClick, actions, title = "Payroll actions" }) => {
	// Map of action keys to their corresponding icons

	return (
		<BoxCard>
			<VStack spacing={0.5} align="stretch">
				<TextTitle size="lg" title={title} />
				<Divider />
				<VStack spacing={0.5} align="stretch">
					{actions?.map(({ key, name, icon }) => (
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
								<Icon as={icon} boxSize={5} color="var(--nav_color)" />

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
