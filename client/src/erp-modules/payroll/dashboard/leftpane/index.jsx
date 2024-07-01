import { Box, HStack, SimpleGrid, VStack } from "@chakra-ui/react";

import TextTitle from "components/ui/text/TextTitle";

const LeftPane = ({ selectedUser, setStats, company }) => {
	const sections = [
		{ name: "Payroll", content: <></> },
		{
			name: "Pay period",
			content: (
				<>
					<VStack spacing={3} alignItems={"start"}>
						<HStack
							w={"100%"}
							justifyContent={"space-between"}
							alignItems={"start"}
						>
							<TextTitle title={"Employees"} />
							<VStack>
								<TextTitle align="end" title={"March 2024 (03/2024)"} />
								<TextTitle align="end" weight="normal" title={"0 Payslips"} />
							</VStack>
						</HStack>
						<HStack
							w={"100%"}
							justifyContent={"space-between"}
							alignItems={"start"}
						>
							<TextTitle title={"Vacations"} />
							<VStack>
								<TextTitle align="end" title={"March 2024 (03/2024)"} />
								<TextTitle align="end" weight="normal" title={"0 Payslips"} />
							</VStack>
						</HStack>
					</VStack>
				</>
			),
		},
		{
			name: "Payroll actions",
			content: (
				<>
					<VStack spacing={3} alignItems={"start"}>
						<HStack
							w={"100%"}
							justifyContent={"space-between"}
							color={"brand.nav_color"}
							px="1em"
							bg={"var(--bg_color_1)"}
							border="3px solid var(--bg_color_1)"
							borderRadius="10px"
							fontWeight="bold"
						>
							<VStack>
								<TextTitle title={"Overview of payroll process"} />
								<TextTitle
									weight="normal"
									title={"Task progress of 200 employees"}
								/>
							</VStack>
							<TextTitle
								title={"45%"}
								align="end"
								color={"var(--primary_button_bg)"}
							/>
						</HStack>

						<VStack spacing={1}>sad</VStack>
					</VStack>
				</>
			),
		},
		{
			name: "Notifications",
			content: (
				<>
					<VStack spacing={3} alignItems={"start"}>
						<VStack spacing={1}>
							<TextTitle title={"Next public holiday"} />
							<TextTitle weight="normal" title={"Sunday - Jul 4, 2024"} />
						</VStack>
						<VStack spacing={1}>
							<TextTitle title={"Next public holiday"} />
							<TextTitle weight="normal" title={"Sunday - Jul 4, 2024"} />
						</VStack>
						<VStack spacing={1}>
							<TextTitle title={"Next public holiday"} />
							<TextTitle weight="normal" title={"Sunday - Jul 4, 2024"} />
						</VStack>
					</VStack>
				</>
			),
		},
	];
	return (
		<Box>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 2 }}
				spacing="1em"
				color={"brand.200"}
			>
				{/* <TimeCard selectedUser={selectedUser} company={company} /> */}

				{sections.map(({ name, content }) => (
					<Box
						key={name}
						color={"brand.nav_color"}
						px="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<TextTitle title={name} mt={2} mb={"1em"} />
						{content}
					</Box>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
