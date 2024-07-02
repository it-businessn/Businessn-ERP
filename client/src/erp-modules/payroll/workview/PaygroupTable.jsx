import {
	Box,
	Button,
	HStack,
	Icon,
	SimpleGrid,
	Tbody,
	Td,
	Tr,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { MdOutlineChevronRight } from "react-icons/md";

const PaygroupTable = () => {
	const PAYGROUP_COLS = [
		"Pay number",
		"Submit by",
		"Pay date",
		"Pay period",
		"Status",
		"Action",
	];
	const PAYGROUP_ACTIONS = [
		"Issue Roes",
		"Issue Forms",
		"Extra Pay Run",
		"Terminate",
		"Update Employees",
	];
	return (
		<SimpleGrid
			columns={{ base: 1, md: 1, lg: 2 }}
			spacing="4"
			my="4"
			mr="4"
			templateColumns={{ lg: "70% 30%" }}
		>
			<Box
				color={"brand.nav_color"}
				p="1em"
				bg={"brand.primary_bg"}
				border="3px solid var(--main_color)"
				borderRadius="10px"
			>
				<TableLayout cols={PAYGROUP_COLS}>
					<Tbody>
						<Tr>
							<Td>45453</Td>
							<Td>{}</Td>
							<Td>19/03/2024</Td>
							<Td>19/02-19/03</Td>
							<Td>
								<Button
									// onClick={onOpen}
									size={"xs"}
									borderRadius={"12px"}
									color={"var(--primary_bg)"}
									bg={"var(--correct_ans)"}
								>
									Paid
								</Button>
							</Td>
							<Td>
								<Button
									variant={"outline"}
									// onClick={onOpen}
									size={"sm"}
									type="submit"
									color={"brand.primary_button_bg"}
								>
									View
								</Button>
							</Td>
						</Tr>
						<Tr>
							<Td>45453</Td>
							<Td>{}</Td>
							<Td>19/03/2024</Td>
							<Td>19/02-19/03</Td>
							<Td>
								<Button
									// onClick={onOpen}
									size={"xs"}
									borderRadius={"12px"}
									color={"var(--primary_bg)"}
									bg={"var(--pending)"}
								>
									Pending
								</Button>
							</Td>
							<Td>
								<PrimaryButton
									// isDisabled={isDisabled}
									name={"Pay now"}
									size="sm"
								/>
							</Td>
						</Tr>
					</Tbody>
				</TableLayout>
			</Box>
			<Box
				color={"brand.nav_color"}
				p="1em"
				bg={"brand.primary_bg"}
				border="3px solid var(--main_color)"
				borderRadius="10px"
			>
				<TextTitle title={"Payroll actions"} mt={2} mb={"1em"} />
				<VStack spacing={3} align={"start"}>
					{PAYGROUP_ACTIONS.map((action) => (
						<HStack spacing={2} key={action}>
							<TextTitle title={action} width="auto" />
							<Icon
								borderRadius={"50%"}
								as={MdOutlineChevronRight}
								// onClick={() => handleChangeDate("prev")}
								boxSize="5"
								color="var(--primary_button_bg)"
							/>
						</HStack>
					))}
				</VStack>
			</Box>
		</SimpleGrid>
	);
};

export default PaygroupTable;
