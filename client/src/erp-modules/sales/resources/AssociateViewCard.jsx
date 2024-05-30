import {
	Badge,
	Box,
	Flex,
	Grid,
	GridItem,
	HStack,
	Image,
	SimpleGrid,
	VStack,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { doughnutOptions } from "constant";
import { BADGES } from "erp-modules/project-management/workview/project/data";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import QuestionnaireService from "services/QuestionnaireService";

const AssociateViewCard = () => {
	const [assessments, setAssessments] = useState(null);
	const [assessmentsTaken, setAssessmentsTaken] = useState(null);

	const user = LocalStorageService.getItem("user");
	const [dataLoaded, setDataLoaded] = useState(false);
	const [completed, setCompleted] = useState(null);
	const [notComplete, setNotComplete] = useState(null);
	const [certificationBadges, setCertificationBadges] = useState(null);

	useEffect(() => {
		const fetchAllAssessmentTypes = async () => {
			try {
				const response = await QuestionnaireService.getAssessmentTypes();
				setAssessments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAssessmentTypes();
		const fetchAssessmentsTaken = async () => {
			try {
				const response = await QuestionnaireService.getAssessmentByUserId(
					user._id,
				);
				const passed = assessmentsTaken?.filter(
					(type) => type.category === "PASS",
				);
				passed?.map((it, index) => (it.badge = BADGES[index]));
				setCertificationBadges(passed);
				const complete = passed?.length || 0;
				const not_completed = assessments?.length - complete || 0;
				setAssessmentsTaken(response.data);
				setCompleted(complete);
				setNotComplete(not_completed);
				setDataLoaded(true);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAssessmentsTaken();
	}, [completed, notComplete]);
	const navigate = useNavigate();

	return (
		<>
			{dataLoaded && (
				<>
					<Box
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
						color={"brand.nav_color"}
						px="1em"
						py="0.5em"
					>
						<TextTitle title="Training Progress" />
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={"1em"}>
							<Box
								w={{ base: "100%", md: "80%", lg: "70%", xl: "40%" }}
								m="auto"
							>
								<Doughnut
									data={{
										labels: ["Completed", "Not complete"],
										datasets: [
											{
												data: [completed, notComplete],
												backgroundColor: ["#49a86f", "#f62f29"],
												hoverBackgroundColor: ["#49a86f", "#f62f29"],
											},
										],
									}}
									options={doughnutOptions("40%")}
								/>
							</Box>

							<Box>
								<TextTitle mt="-1.5em" title="Product Certifications" />
								{!certificationBadges && (
									<TextTitle
										mt="1em"
										em="italic"
										title={`Complete the assessments to earn a badge of achievement. \nScore 100% to complete any assessment!`}
										weight="normal"
										whiteSpace="pre-wrap"
									/>
								)}
								<Grid templateColumns="repeat(auto-fill, 100px)" gap={3}>
									{certificationBadges?.map((item, index) => (
										<GridItem key={index}>
											<VStack w="100%" justifyContent={"center"} mt="1.5em">
												<Image
													src={item.badge}
													alt={`Certification Badge ${index + 1}`}
													boxSize="100px"
												/>
												<Badge
													w={"100%"}
													bg="var(--lead_cards_bg)"
													color="var(--primary_button_bg)"
												>
													<TextTitle
														size="sm"
														align={"center"}
														title={item.subject.split(" - ")[0]}
													/>
												</Badge>
											</VStack>
										</GridItem>
									))}
								</Grid>
							</Box>
						</SimpleGrid>
					</Box>

					<Box
						p="1em"
						pt={"0.5em"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
						color={"brand.nav_color"}
					>
						<HStack>
							<TextTitle flex={1} mb={"0.5em"} title="Assessments overview" />
						</HStack>

						<SimpleGrid
							columns={{ base: 1, md: 1, lg: 4, xl: 6 }}
							minH={{ base: "auto", md: "90%", lg: "auto" }}
							spacing={"1em"}
						>
							{assessments?.map((assessment) => {
								const assessmentResult = assessmentsTaken?.find(
									(type) => type.subject === assessment.name,
								);
								if (assessmentResult) {
									assessmentResult.color =
										assessmentResult?.category === "PASS"
											? "var(--correct_ans)"
											: "var(--almost_pass)";
									assessmentResult.bg =
										assessmentResult?.category === "PASS"
											? "var(--phoneCall_bg_light)"
											: "var(--receiver_msg_bg)";
								}
								return (
									<Box
										key={assessment._id}
										p={{ base: "1em", lg: "1em 5px" }}
										my={"auto"}
										bg={"brand.primary_bg"}
										border="3px solid var(--main_color)"
										borderRadius="10px"
										fontWeight="bold"
										display="flex"
										flexDir="column"
										justifyContent="space-evenly"
										alignItems="flex-start"
										w={"100%"}
									>
										<Flex
											flexDir={"column"}
											align={"self-start"}
											w={"100%"}
											gap={2}
										>
											{/* <TextTitle
													color={"brand.nav_color"}
													size="xs"
													title="Assessment:"
												/> */}
											<Badge
												bg="var(--primary_bg)"
												size={"xs"}
												color="var(--primary_button_bg)"
												minH={{ base: "5em", lg: "3em" }}
												display={"flex"}
												// alignItems={"center"}
												textDecor={"underline"}
												w={"100%"}
												cursor={"pointer"}
												onClick={() =>
													navigate(`/sales/assessment/${assessment.name}`)
												}
											>
												<TextTitle
													title={assessment?.name.split(" - ")[1]}
													whiteSpace="pre-wrap"
												/>
											</Badge>
											<HStack justify={"space-between"} w={"100%"}>
												<TextTitle
													color={"brand.nav_color"}
													size="xs"
													title="Your Result:"
												/>
												{assessmentResult?.category ? (
													<Badge
														bg={assessmentResult?.bg}
														color={assessmentResult?.color}
													>
														{assessmentResult?.category}
													</Badge>
												) : (
													<Badge
														bg="green"
														color="var(--main_color)"
														visibility={"hidden"}
													>
														NA
													</Badge>
												)}
											</HStack>

											<HStack justify={"space-between"} w={"100%"}>
												<VStack>
													<TextTitle
														color={"brand.nav_color"}
														size="xs"
														title="Score"
													/>
													<TextTitle
														title={
															assessmentResult ? assessmentResult.result : "NA"
														}
													/>
												</VStack>
												<VStack>
													<TextTitle
														color={"brand.nav_color"}
														size="xs"
														title="Score(%)"
													/>
													<TextTitle
														title={`${
															assessmentResult
																? (
																		(assessmentResult.score /
																			assessmentResult.total) *
																		100
																  ).toFixed(2)
																: "NA"
														}
														%`}
													/>
												</VStack>
											</HStack>
											<PrimaryButton
												size={"xs"}
												name={assessmentResult ? "Re-Take" : "Take"}
												Assessment
												onOpen={() =>
													navigate(`/sales/assessment/${assessment.name}`)
												}
												minW={"100%"}
											/>
										</Flex>
									</Box>
								);
							})}
						</SimpleGrid>
					</Box>
				</>
			)}
			{!dataLoaded && <Loader />}
		</>
	);
};

export default AssociateViewCard;
