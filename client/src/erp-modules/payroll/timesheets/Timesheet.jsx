import { HStack, Tbody, Td, Tr } from "@chakra-ui/react";
import Loader from "components/Loader";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { getDateDiffHours, getDefaultTime } from "utils";

const Timesheet = ({ timesheets }) => {
	const CollapsibleTable = ({ data }) => {
		const [isOpen, setIsOpen] = useState(false);

		const toggleAccordion = () => {
			setIsOpen(!isOpen);
		};

		const [isExpanded, setExpanded] = useState(1);

		const COLS = [
			"Employees",
			"Status",
			"Department",
			"Pay Rate",
			"Pay Type",
			"Start Time",
			"End Time",
			"Break/Lunch",
			"Total Hours",
		];
		const handleToggle = (index) => {
			setExpanded(isExpanded === index ? -1 : index);
		};

		return (
			<>
				{!timesheets && <Loader />}
				{timesheets && (
					<TableLayout isTimesheet cols={COLS}>
						<Tbody>
							{data.map(
								(
									{
										_id,
										employeeId,
										approveStatus,
										payType,
										payRate,
										clockIns,
										clockOuts,
										startBreaks,
										endBreaks,
									},
									index,
								) => {
									return (
										<React.Fragment key={_id}>
											<Tr>
												<Td>
													<HStack justify={"space-around"}>
														{isExpanded === index ? (
															<FaChevronUp
																onClick={(e) => {
																	e.preventDefault();
																	handleToggle(index);
																}}
															/>
														) : (
															<FaChevronDown
																onClick={(e) => {
																	e.preventDefault();
																	handleToggle(index);
																}}
															/>
														)}
														<TextTitle
															title={employeeId.fullName}
															weight="normal"
														/>
													</HStack>
												</Td>
												<Td>{approveStatus}</Td>
												<Td>{employeeId.role}</Td>
												<Td>{payRate}</Td>
												<Td>{payType}</Td>
												<Td>
													{clockIns.length > 0
														? getDefaultTime(clockIns[0])
														: ""}
												</Td>
												<Td>
													{clockOuts.length > 0
														? getDefaultTime(clockOuts[clockOuts.length - 1])
														: ""}
												</Td>
												<Td>
													{getDateDiffHours(
														startBreaks[startBreaks.length - 1],
														endBreaks[endBreaks.length - 1],
													)}
												</Td>
												<Td>
													{getDateDiffHours(
														clockIns[0],
														clockOuts[clockOuts.length - 1],
													)}
												</Td>
											</Tr>
											{isExpanded === index && (
												<Tr>
													<Td>{employeeId.fullName}</Td>
													<Td>{"prokjec name"}</Td>
												</Tr>
											)}
										</React.Fragment>
									);
								},
							)}
						</Tbody>
					</TableLayout>
				)}
			</>
		);
	};

	return <CollapsibleTable data={timesheets} />;
};

export default Timesheet;
