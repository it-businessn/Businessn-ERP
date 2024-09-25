import {
	Box,
	Flex,
	HStack,
	Icon,
	Progress,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import HighlightButton from "components/ui/button/HighlightButton";
// import RightIconButton from "components/ui/button/RightIconButton";
import BoxCard from "components/ui/card";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { useState } from "react";
import { RiAspectRatioLine } from "react-icons/ri";

const Contest = () => {
	const [showDetails, setShowDetails] = useState(false);

	return (
		<Box>
			{/* {["Contests For Sales", "Contests For Activity"].map((item) => ( */}
			{["Contests For Sales"].map((item) => (
				<BoxCard key={item} p="0.5em 1em">
					<Text fontWeight="bold" fontSize={"sm"}>
						{item}
					</Text>
					<SimpleGrid columns={{ md: 3 }} spacing={4}>
						{/* {["Monthly Top Performer", "Sale 2", "Sale 3"].map((item) => ( */}
						{["Bi-weekly Top Performer"].map((item) => (
							<BoxCard key={item}>
								<HStack alignItems="self-start" spacing={2}>
									<Icon as={RiAspectRatioLine} color="orange" boxSize={8} />
									<VStack spacing={0} alignItems={"start"}>
										<Text fontWeight="bold" fontSize={"sm"}>
											{item}
										</Text>
										<Text fontSize="xs" p={0}>
											$500 Cash Bonus
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
										$500
									</Text>
									<Progress
										colorScheme="green"
										size="sm"
										bg={"var(--main_color)"}
										value={2}
									/>
									<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
										<HighlightButton
											name={"More details"}
											onClick={() => setShowDetails(true)}
										/>
									</Flex>
								</Box>
							</BoxCard>
						))}
					</SimpleGrid>

					{/* <BoxCard mt={"1em"}>
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
					</BoxCard> */}
					{/* <BoxCard mt={"1em"}>
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
					</BoxCard> */}
				</BoxCard>
			))}
			{showDetails && (
				<ModalLayout
					title={"More Information"}
					size="md"
					isOpen={showDetails}
					onClose={() => setShowDetails(false)}
				>
					<NormalTextTitle
						whiteSpace={"wrap"}
						title={
							"This sales bonus will be awarded to the sales agent with the highest dollar value in sales in each bi-weekly period. Sales for all contracts are calculated based on the annualized projected total sales of all sales contracts completed in the period.  For more information, please contact your manager."
						}
					/>
				</ModalLayout>
			)}
		</Box>
	);
};

export default Contest;
