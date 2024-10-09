import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { getTimeCardFormat } from "utils";

const Timecard = ({ company, userId, timecardRefresh, filter }) => {
	const [timeRecords, setTimeRecords] = useState(null);

	useEffect(() => {
		const fetchAllTimecards = async () => {
			try {
				const post = await TimesheetService.addTimecard([]);
				if (post.data) {
					const response = await TimesheetService.getTimecards();
					setTimeRecords(response.data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllTimecards();
	}, [timecardRefresh]);

	return (
		<TableLayout
			cols={[
				"Employee Name",
				"TM Badge ID",
				"Clock In",
				"Clock Out",
				"Start Break1",
				"End Break1",
				"Start Break2",
				"End Break2",
				"Start Break3",
				"End Break3",
				"Total Hours (HH:mm)",
			]}
			height="75vh"
			position="sticky"
			zIndex="docked"
			top={-1}
		>
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
						totalWorkedHours,
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
									<NormalTextTitle
										size={"sm"}
										title={
											startBreaks?.length
												? getTimeCardFormat(startBreaks[0], notDevice)
												: ""
										}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={
											endBreaks?.length
												? getTimeCardFormat(endBreaks[0], notDevice)
												: ""
										}
									/>
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
									{totalWorkedHours}
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
