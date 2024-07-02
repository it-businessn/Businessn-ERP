import { Box, Button, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TableLayout from "components/ui/table/TableLayout";

const PaygroupWorkview = () => {
	const PAYGROUP_COLS = [
		"Employee ID",
		"Name",
		"Department",
		"Rate",
		"Reg. Hrs",
		"Retro Pay",
		"Overtime",
		"Stat Pay",
		"Commission",
		"Vacation Hours",
		"BC Sick Pay",
		"Reimbursement",
	];
	return (
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
						<Td></Td>
						<Td></Td>
						<Td>{}</Td>
						<Td>{}</Td>
						<Td>{}</Td>
						<Td>{}</Td>
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
					<Tr>
						<Td>45453</Td>
						<Td>{}</Td>
						<Td>19/03/2024</Td>
						<Td>19/02-19/03</Td>
						<Td></Td>
						<Td></Td>
						<Td>{}</Td>
						<Td>{}</Td>
						<Td>{}</Td>
						<Td>{}</Td>
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
	);
};

export default PaygroupWorkview;
