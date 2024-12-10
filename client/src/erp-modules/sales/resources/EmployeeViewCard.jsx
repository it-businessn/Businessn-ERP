import { Badge, Box, Grid, GridItem, HStack, Image, SimpleGrid, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { doughnutOptions } from "constant";
import { BADGES } from "erp-modules/project-management/workview/project/data";

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import AssessmentService from "services/AssessmentService";
import LocalStorageService from "services/LocalStorageService";
import AttemptedTestScore from "./AttemptedTestScore";

const EmployeeViewCard = ({ company }) => {
	const loggedInUser = LocalStorageService.getItem("user");
	const [assessments, setAssessments] = useState(null);
	const [assessmentsTaken, setAssessmentsTaken] = useState(null);

	const [dataLoaded, setDataLoaded] = useState(false);
	const [completed, setCompleted] = useState(null);
	const [notComplete, setNotComplete] = useState(null);
	const [certificationBadges, setCertificationBadges] = useState(null);
	const [totalBadges, setTotalBadges] = useState(null);

	useEffect(() => {
		const fetchAllAssessmentTypes = async () => {
			try {
				const { data } = await AssessmentService.getAssessmentTypes(company);
				setAssessments(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAssessmentTypes();
	}, [company]);

	useEffect(() => {
		const fetchAssessmentsTaken = async () => {
			try {
				const { data } = await AssessmentService.getAssessmentByUserId(loggedInUser._id);
				const passed = data?.filter((type) => type.category === "PASS");

				const complete = passed.length;
				const not_completed = assessments?.length - complete || 0;

				setAssessmentsTaken(data);
				setCompleted(complete);
				setNotComplete(not_completed);

				passed?.map((_) => (_.badge = BADGES[Math.floor(Math.random() * BADGES.length)]));
				const counts = passed?.reduce((acc, obj) => {
					acc[obj.subject] = (acc[obj.subject] || 0) + 1;
					return acc;
				}, {});

				setTotalBadges(counts);
				setDataLoaded(true);
			} catch (error) {
				console.error(error);
			}
		};
		if (assessments) {
			fetchAssessmentsTaken();
		}
	}, [assessments]);

	useEffect(() => {
		const i = [];
		if (totalBadges) {
			Object.keys(totalBadges).map((_) => {
				i.push({ type: _, count: 1 });

				return _;
			});
			setCertificationBadges(i);
		}
	}, [totalBadges]);

	return (
		dataLoaded && (
			<>
				<Box
					bg={"var(--primary_bg)"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
					color={"var(--nav_color)"}
					px="1em"
					py="0.5em"
				>
					<TextTitle title="Training Progress" />
					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={"1em"}>
						<Box w={{ base: "100%", md: "80%", lg: "70%", xl: "40%" }} m="auto">
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
							{(!certificationBadges || certificationBadges.length === 0) && (
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
												src={BADGES[Math.floor(Math.random() * BADGES.length)]}
												alt={`Certification Badge ${index + 1}`}
												boxSize="100px"
											/>
											<Badge w={"100%"} bg="var(--lead_cards_bg)" color="var(--primary_button_bg)">
												<TextTitle
													size="sm"
													align={"center"}
													title={item?.type?.split(" - ")[0]}
													whiteSpace="pre-wrap"
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
					color={"var(--nav_color)"}
				>
					<HStack>
						<TextTitle flex={1} mb={"0.5em"} title="Assessments overview" />
					</HStack>
					<SimpleGrid
						columns={{ base: 1, md: 1, lg: 4, xl: 6 }}
						minH={{ base: "auto", md: "90%", lg: "auto" }}
						spacing={"1em"}
					>
						{assessments?.map((item) => {
							const passResult = assessmentsTaken?.find(
								(type) => item.name.includes(type.subject) && type.category === "PASS",
							);

							if (passResult) {
								passResult.color = "var(--correct_ans)";
								passResult.bg = "var(--phoneCall_bg_light)";
							}

							const failResult = assessmentsTaken?.find(
								(type) => item.name.includes(type.subject) && type.category === "ALMOST!",
							);
							if (failResult) {
								failResult.color = "var(--almost_pass)";
								failResult.bg = "var(--receiver_msg_bg)";
							}
							return (
								<AttemptedTestScore
									key={item._id}
									assessment={item}
									failResult={failResult}
									passResult={passResult}
								/>
							);
						})}
					</SimpleGrid>
				</Box>
			</>
		)
	);
};

export default EmployeeViewCard;
