import { HStack, Tbody, Td, Tr } from "@chakra-ui/react";
import Loader from "components/Loader";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import { getDateDiffHours, getDefaultTime } from "utils";
import AddProject from "./AddProject";

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
			"Total Hours (HH:mm)",
		];
		const handleToggle = (index) => {
			setExpanded(isExpanded === index ? -1 : index);
		};

		const [showAddProject, setShowAddProject] = useState(false);
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
										projectEntries,
									},
									index,
								) => {
									return (
										<React.Fragment key={_id}>
											<Tr>
												<Td>
													<HStack
														justify={"start"}
														onClick={(e) => {
															e.preventDefault();
															handleToggle(index);
														}}
													>
														{isExpanded === index ? (
															<FaChevronUp />
														) : (
															<FaChevronDown />
														)}
														<TextTitle
															title={employeeId?.fullName}
															weight="normal"
														/>
													</HStack>
												</Td>
												<Td>{approveStatus}</Td>
												<Td>{employeeId?.role}</Td>
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
												<>
													{projectEntries.length === 0 && (
														<Tr>
															<Td>
																<HStack justify={"start"} cursor={"pointer"}>
																	<FaPlus
																		onClick={() => setShowAddProject(true)}
																	/>
																	<TextTitle
																		title={"Add Project"}
																		weight="normal"
																	/>
																</HStack>
															</Td>
														</Tr>
													)}
													{projectEntries?.map((_) => (
														<Tr key={_}>
															<Td>
																<HStack justify={"start"} cursor={"pointer"}>
																	<FaPlus
																		onClick={() => setShowAddProject(true)}
																	/>
																	<TextTitle title={"x.name"} weight="normal" />
																</HStack>
															</Td>
														</Tr>
													))}
												</>
											)}
											{/* {isExpanded === index && (
												<>
													{projectEntries?.map((_) =>
														_.map((x) => (
															<Tr key={x.name}>
																<Td>
																	<HStack justify={"start"}>
																		<FaPlus
																			onClick={() => setShowAddProject(true)}
																		/>
																		<TextTitle title={x.name} weight="normal" />
																	</HStack>
																</Td>
															</Tr>
														)),
													)}
												</>
											)} */}
										</React.Fragment>
									);
								},
							)}
						</Tbody>
					</TableLayout>
				)}
				<AddProject
					showAddProject={showAddProject}
					// setRefresh={setRefresh}
					setShowAddProject={setShowAddProject}
				/>
			</>
		);
	};

	return <CollapsibleTable data={timesheets} />;
};

export default Timesheet;
