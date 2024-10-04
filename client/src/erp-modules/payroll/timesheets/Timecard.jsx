import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { getTimeCardFormat } from "utils";

const Timecard = ({ cols, company, userId, timecardRefresh, filter }) => {
	const [timeRecords, setTimeRecords] = useState(null);

	const fetchAllTimecards = async () => {
		try {
			await TimesheetService.addTimecard([]);
			const response = await TimesheetService.getTimecards();
			setTimeRecords(response.data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchAllTimecards();
	}, [timecardRefresh]);

	return (
		<TableLayout cols={cols} height="75vh">
			<Tbody>
				{!timeRecords?.length && <EmptyRowRecord />}
				{timeRecords?.map(
					({
						_id,
						employeeName,
						badge_id,
						clockIn,
						clockOut,
						startBreaks,
						endBreaks,
						totalBreakHours,
						notDevice,
						breakIn,
						breakOut,
					}) => {
						return (
							<Tr key={_id} h={"20px"}>
								<Td p={0.5} pl={6}>
									<TextTitle size={"sm"} width="150px" title={employeeName} />
								</Td>
								<Td p={0.5} pl={6}>
									<TextTitle width="60px" size={"sm"} title={badge_id} />
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={clockIn && getTimeCardFormat(clockIn, notDevice)}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={clockOut && getTimeCardFormat(clockOut, notDevice)}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									{/* <NormalTextTitle
										size={"sm"}
										title={
											startBreaks?.length
												? getTimeCardFormat(startBreaks[0], notDevice)
												: ""
										}
									/> */}
									<NormalTextTitle
										size={"sm"}
										title={breakOut && getTimeCardFormat(breakOut, notDevice)}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={breakIn && getTimeCardFormat(breakIn, notDevice)}
									/>
									{/* <NormalTextTitle
										size={"sm"}
										title={
											endBreaks?.length
												? getTimeCardFormat(endBreaks[0], notDevice)
												: ""
										}
									/> */}
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={
											startBreaks?.length > 1
												? getTimeCardFormat(startBreaks[1], notDevice)
												: ""
										}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={
											endBreaks?.length > 1
												? getTimeCardFormat(endBreaks[1], notDevice)
												: ""
										}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={
											startBreaks?.length > 2
												? getTimeCardFormat(startBreaks[2], notDevice)
												: ""
										}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={
											endBreaks?.length > 2
												? getTimeCardFormat(endBreaks[2], notDevice)
												: ""
										}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									{totalBreakHours}
								</Td>
							</Tr>
						);
					},
				)}
			</Tbody>
		</TableLayout>
	);
};

export default Timecard;
