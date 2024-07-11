import { Badge, Box, Flex, HStack, Image, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useNavigate } from "react-router-dom";
import award from "../../../assets/award.jpeg";

const AttemptedTestScore = ({ assessment, passResult, failResult }) => {
	const navigate = useNavigate();
	return (
		<Box
			p={{ base: "1em", lg: "1em 5px" }}
			my={"auto"}
			bg={"var(--primary_bg)"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
			display="flex"
			flexDir="column"
			justifyContent="space-evenly"
			alignItems="flex-start"
			w={"100%"}
		>
			<Flex flexDir={"column"} align={"self-start"} w={"100%"} gap={2}>
				<HStack justify={"space-between"} alignItems={"self-start"} w={"100%"}>
					<Badge
						bg="var(--primary_bg)"
						size={"xs"}
						minH={{ base: "5em", lg: "3em" }}
						display={"flex"}
						textDecor={"underline"}
						w={"100%"}
						cursor={"pointer"}
						onClick={() => navigate(`/sales/assessment/${assessment.name}`)}
					>
						<TextTitle
							color="var(--primary_button_bg)"
							title={assessment?.name?.split(" - ")[1] || assessment?.name}
							whiteSpace="pre-wrap"
						/>
					</Badge>
					{assessment.hasAward === "Yes" && <Image src={award} alt={"award"} />}
				</HStack>
				<HStack justify={"space-between"} w={"100%"}>
					<TextTitle
						color={"var(--nav_color)"}
						size="xs"
						title="Your Result:"
					/>
					{passResult?.category ? (
						<Badge bg={passResult?.bg} color={passResult?.color}>
							{passResult?.category}
						</Badge>
					) : failResult?.category ? (
						<Badge bg={failResult?.bg} color={failResult?.color}>
							{failResult?.category}
						</Badge>
					) : (
						<Badge bg="green" color="var(--main_color)" visibility={"hidden"}>
							NA
						</Badge>
					)}
				</HStack>
				<HStack justify={"space-between"} w={"100%"}>
					<VStack>
						<TextTitle color={"var(--nav_color)"} size="xs" title="Score" />
						<TextTitle
							title={
								passResult
									? passResult.result
									: failResult
									? failResult.result
									: "NA"
							}
						/>
					</VStack>
					<VStack>
						<TextTitle color={"var(--nav_color)"} size="xs" title="Score(%)" />
						<TextTitle
							title={`${
								passResult
									? ((passResult.score / passResult.total) * 100).toFixed(2)
									: failResult
									? ((failResult.score / failResult.total) * 100).toFixed(2)
									: "NA"
							}
                %`}
						/>
					</VStack>
				</HStack>
				<PrimaryButton
					size={"xs"}
					name={passResult || failResult ? "Re-Take" : "Take"}
					Assessment
					onOpen={() => navigate(`/sales/assessment/${assessment.name}`)}
					minW={"100%"}
				/>
			</Flex>
		</Box>
	);
};

export default AttemptedTestScore;
