import {
	Box,
	Button,
	HStack,
	Heading,
	Icon,
	Square,
	Stack,
	Text,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const UserStat = (props) => {
	const { label, value, icon, period, range, delta, ...boxProps } = props;
	return (
		<Box
			px={{
				base: "4",
				md: "6",
			}}
			py={{
				base: "5",
				md: "6",
			}}
			bg="bg.surface"
			borderRadius="lg"
			boxShadow="sm"
			{...boxProps}
		>
			<Stack>
				<Stack direction="row" justify="space-between">
					<HStack spacing="4">
						<Square size="12" bg="bg.accent.subtle" borderRadius="md">
							<Icon as={icon} boxSize="6" color="fg.accent.default" />
						</Square>
						<Text fontWeight="medium">{label}</Text>
					</HStack>
				</Stack>
				<Stack>
					<Heading
						size={{
							base: "sm",
							md: "md",
						}}
					>
						{value}
					</Heading>
					{delta && (
						<HStack spacing="1" justify="space-between" fontSize="sm">
							{delta.value && <Text>{delta.value}</Text>}
							{delta.value2 && <Text>{delta.value2}</Text>}
							{delta.link && (
								<Link to="/leave-detail">
									<Button rightIcon={<FiArrowRight />} variant="link">
										{delta.link}
									</Button>
								</Link>
							)}
						</HStack>
					)}
				</Stack>
			</Stack>
		</Box>
	);
};
export default UserStat;
