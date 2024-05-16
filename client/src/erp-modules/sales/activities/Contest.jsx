import {
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	Progress,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import HighlightButton from "components/ui/button/HighlightButton";
import RightIconButton from "components/ui/button/RightIconButton";
import { RiAspectRatioLine } from "react-icons/ri";

const Contest = () => {
	return (
		<>
			{["Contests For Sales", "Contests For Activity"].map((item) => (
				<Box
					key={item}
					p="0.5em 1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
				>
					<Text fontWeight="bold" fontSize={"sm"}>
						{item}
					</Text>
					<SimpleGrid columns={{ md: 3 }} spacing={4}>
						{["Sale 1", "Sale 2", "Sale 3"].map((item) => (
							<Box
								key={item}
								p="1em"
								bg={"brand.primary_bg"}
								border="3px solid var(--main_color)"
								borderRadius="10px"
								fontWeight="bold"
							>
								<HStack alignItems="self-start" spacing={2}>
									<Icon as={RiAspectRatioLine} color="orange" boxSize={8} />
									<VStack spacing={0} alignItems={"start"}>
										<Text fontWeight="bold" fontSize={"sm"}>
											{item}
										</Text>
										<Text fontSize="xs" p={0}>
											1st place
										</Text>
									</VStack>
								</HStack>
								<Box>
									<Text
										mt={"2em"}
										fontSize={"xs"}
										display={"flex"}
										justifyContent={"end"}
									>
										$5460
									</Text>
									<Progress
										colorScheme="green"
										size="sm"
										bg={"var(--main_color)"}
										value={50}
									/>
									<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
										<HighlightButton name={"More details"} />
									</Flex>
								</Box>
							</Box>
						))}
					</SimpleGrid>
					<Box
						mt={"1em"}
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<HStack alignItems="self-start" spacing={2}>
							<Icon as={RiAspectRatioLine} color="orange" boxSize={8} />
							<VStack spacing={0} alignItems={"start"}>
								<Text fontWeight="bold">Sale 4</Text>
								<Text fontSize="xs" p={0}>
									1st Place
								</Text>
							</VStack>
						</HStack>
						<Box>
							<Text
								mt={"2em"}
								fontSize={"xs"}
								display={"flex"}
								justifyContent={"end"}
							>
								$5460
							</Text>
							<Progress
								colorScheme="green"
								size="sm"
								bg={"var(--main_color)"}
								value={50}
							/>
							<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
								<Button
									bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
									bgClip="text"
									size={"xxs"}
								>
									More details
									<RightIconButton />
								</Button>
							</Flex>
						</Box>
					</Box>
					<Box
						mt={"1em"}
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<HStack alignItems="self-start" spacing={2}>
							<Icon as={RiAspectRatioLine} color="orange" boxSize={8} />
							<VStack spacing={0} alignItems={"start"}>
								<Text fontWeight="bold">Sale 5</Text>
								<Text fontSize="xs" p={0}>
									1st Place
								</Text>
							</VStack>
						</HStack>
						<Box>
							<Text
								mt={"2em"}
								fontSize={"xs"}
								display={"flex"}
								justifyContent={"end"}
							>
								$5460
							</Text>
							<Progress
								colorScheme="green"
								size="sm"
								bg={"var(--main_color)"}
								value={50}
							/>
							<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
								<Button
									bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
									bgClip="text"
									size={"xxs"}
								>
									More details
									<RightIconButton />
								</Button>
							</Flex>
						</Box>
					</Box>
				</Box>
			))}
		</>
	);
};

export default Contest;
