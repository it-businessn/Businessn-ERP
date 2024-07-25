import {
	HStack,
	Icon,
	SimpleGrid,
	Tbody,
	Td,
	Tr,
	VStack,
} from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import { formatDateBar, formatDateRange } from "utils";
import { PAYGROUP_ACTIONS, PAYGROUP_COLS } from "./data";
import PayrunModal from "./PayrunModal";

const PaygroupTable = ({ selectedPayGroup }) => {
	const [showExtraPayrun, setShowExtraPayrun] = useState(false);
	const [refresh, setRefresh] = useState(false);
	// const payruns=usePayrun()
	return (
		<SimpleGrid
			columns={{ base: 1, md: 1, lg: 2 }}
			spacing="4"
			my="4"
			mr="4"
			templateColumns={{ lg: "70% 30%" }}
		>
			<BoxCard>
				<VStack w={"100%"} alignItems={"end"} spacing={0}>
					<PrimaryButton
						name={"Add extra payrun"}
						size="xs"
						px={0}
						hover={"transparent"}
						onOpen={() => setShowExtraPayrun(true)}
					/>
					{showExtraPayrun && (
						<PayrunModal
							showExtraPayrun={showExtraPayrun}
							setRefresh={setRefresh}
							setShowExtraPayrun={setShowExtraPayrun}
						/>
					)}

					<TableLayout cols={PAYGROUP_COLS} w={"100%"}>
						<Tbody>
							<Tr>
								<Td>45453</Td>
								<Td>{""}</Td>
								<Td>
									{formatDateBar(selectedPayGroup?.scheduleSettings.payDate)}
								</Td>
								<Td>
									{formatDateRange(
										selectedPayGroup?.scheduleSettings.startDate,
										selectedPayGroup?.scheduleSettings.endDate,
									)}
								</Td>
								<Td>
									<PrimaryButton
										color={"var(--primary_bg)"}
										bg={"var(--correct_ans)"}
										name={"Paid"}
										size="xs"
										px={0}
										hover={"transparent"}
									/>
								</Td>
								<Td>
									<OutlineButton label={"View"} size="xs" />
								</Td>
							</Tr>
							<Tr>
								<Td>45453</Td>
								<Td>{}</Td>
								<Td>19/03/2024</Td>
								<Td>19/02-19/03</Td>
								<Td>
									<PrimaryButton
										color={"var(--primary_bg)"}
										bg={"var(--pending)"}
										name={"Pending"}
										size="xs"
										px={0}
										hover={"transparent"}
									/>
								</Td>
								<Td>
									<PrimaryButton
										// isDisabled={isDisabled}
										name={"Pay now"}
										size="xs"
									/>
								</Td>
							</Tr>
						</Tbody>
					</TableLayout>
				</VStack>
			</BoxCard>
			<BoxCard>
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
			</BoxCard>
		</SimpleGrid>
	);
};

export default PaygroupTable;
