import { Box, Collapse, HStack, Icon, Text } from "@chakra-ui/react";
import { FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

// ROE-01: a collapsible step of the Issue ROE screens. A confirmed step folds
// up (with a tick); click its title to open it again.
const RoeSection = ({ title, isOpen, onToggle, isDone, summary, children }) => (
	<Box border="1px solid" borderColor="var(--border_soft)" borderRadius="md" bg="white" className="theme-paper">
		<HStack
			as="button"
			type="button"
			w="100%"
			px={4}
			py={3}
			justify="space-between"
			onClick={onToggle}
			aria-expanded={isOpen}
		>
			<HStack spacing={3}>
				{isDone && <Icon as={FaCheckCircle} color="green.500" aria-label="confirmed" />}
				<Text fontWeight="bold" fontSize="lg">
					{title}
				</Text>
				{!isOpen && summary && (
					<Text color="var(--text_soft)" fontSize="sm" noOfLines={1}>
						{summary}
					</Text>
				)}
			</HStack>
			<Icon as={isOpen ? FaChevronUp : FaChevronDown} color="var(--text_soft)" />
		</HStack>
		<Collapse in={isOpen} animateOpacity unmountOnExit>
			<Box px={4} pb={4}>
				{children}
			</Box>
		</Collapse>
	</Box>
);

export default RoeSection;
