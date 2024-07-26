import { SimpleGrid, Tbody, Td, Tr, VStack } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import TableLayout from "components/ui/table/TableLayout";
import { useState } from "react";
import { formatDateBar, formatDateRange, sortRecordsByDate } from "utils";
import { PAYGROUP_COLS } from "../data";
import ExtraPayrunModal from "./ExtraPayrunModal";
import PayrollActions from "./PayrollActions";

const PaygroupTable = ({
	selectedPayGroup,
	company,
	payGroupSchedule,
	setRefresh,
}) => {
	const [showExtraPayrun, setShowExtraPayrun] = useState(false);

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
						<ExtraPayrunModal
							selectedPayGroupId={selectedPayGroup._id}
							company={company}
							showExtraPayrun={showExtraPayrun}
							setRefresh={setRefresh}
							setShowExtraPayrun={setShowExtraPayrun}
							selectedPayGroup={selectedPayGroup}
							payGroupSchedule={payGroupSchedule}
						/>
					)}

					<TableLayout
						cols={PAYGROUP_COLS}
						w={"100%"}
						isSmall
						height="17vh"
						position="sticky"
						top={-1}
						zIndex="docked"
					>
						<Tbody>
							{sortRecordsByDate(payGroupSchedule, "payPeriodPayDate")?.map(
								({
									payPeriod,
									payPeriodProcessingDate,
									payPeriodStartDate,
									payPeriodEndDate,
									payPeriodPayDate,
									isProcessed,
									color,
									name,
									bg,
									isViewAction,
									isDisabledStatus,
								}) => (
									<Tr key={payPeriod}>
										<Td p={1}>{payPeriod}</Td>
										<Td p={1}>{formatDateBar(payPeriodProcessingDate)}</Td>
										<Td p={1}>{formatDateBar(payPeriodPayDate)}</Td>
										<Td p={1}>
											{formatDateRange(payPeriodStartDate, payPeriodEndDate)}
										</Td>
										<Td p={1}>
											<PrimaryButton
												color={color}
												bg={bg}
												name={name}
												size="xs"
												px={0}
												isDisabled={isDisabledStatus}
												hover={"transparent"}
											/>
										</Td>
										<Td p={1}>
											{isViewAction ? (
												<OutlineButton label={"View"} size="xs" />
											) : (
												<PrimaryButton
													// isDisabled={isDisabled}
													name={"Pay now"}
													size="xs"
												/>
											)}
										</Td>
									</Tr>
								),
							)}
						</Tbody>
					</TableLayout>
				</VStack>
			</BoxCard>
			<PayrollActions />
		</SimpleGrid>
	);
};

export default PaygroupTable;
