import { Badge, Box, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Loader from "components/Loader";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { doughnutOptions } from "constant";
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
				const complete =
					assessmentsTaken?.filter((type) => type.category === "PASS")
						?.length || 0;
				const not_completed = assessments?.length - complete?.length || 0;
				setAssessmentsTaken(response.data);
				setCompleted(complete);
				setNotComplete(not_completed);
				setTimeout(() => {
					setDataLoaded(true);
				}, 2000);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAssessmentsTaken();
	}, [completed, notComplete]);
	const navigate = useNavigate();

	return (
		<>
			{!dataLoaded && <Loader />}
			{dataLoaded && (
				<>
					<Box
						px="1em"
						py="0.5em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
						color={"brand.nav_color"}
					>
						<TextTitle title="Training" />

						<Box
							w={{ base: "60%", md: "40%", lg: "60%", xl: "40%" }}
							mx={"auto"}
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
							<TextTitle flex={1} mb={"0.5em"} title="Your Overall Results" />
						</HStack>

						<SimpleGrid
							columns={{ base: 1, md: 1, lg: 3, xl: 3 }}
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
									>
										<VStack align={"self-start"} spacing={2} w={"100%"}>
											<HStack>
												<TextTitle
													color={"brand.nav_color"}
													size="xs"
													title="Assessment :"
												/>
												<Badge
													bg="var(--meeting_bg_light)"
													size={"xs"}
													color="var(--primary_button_bg)"
												>
													{assessment?.name}
												</Badge>
											</HStack>
											<HStack>
												<TextTitle
													color={"brand.nav_color"}
													size="xs"
													title="Your Result :"
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
												onClick={() =>
													navigate(`/sales/assessment/${assessment.name}`)
												}
												minW={"100%"}
											/>
										</VStack>
									</Box>
								);
							})}
						</SimpleGrid>
					</Box>
				</>
			)}
		</>
	);
};

export default AssociateViewCard;
