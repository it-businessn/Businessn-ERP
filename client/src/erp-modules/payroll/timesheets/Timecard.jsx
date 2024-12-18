import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { getTimeCardFormat } from "utils/convertDate";

const Timecard = ({ company, userId, timecardRefresh, filter }) => {
	const [timeRecords, setTimeRecords] = useState(null);

	useEffect(() => {
		const fetchAllTimecards = async () => {
			try {
				const { data } = await TimesheetService.getTimecards(company);
				setTimeRecords(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllTimecards();
	}, [timecardRefresh]);

	const cols = [
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
	];

	return (
		<TableLayout cols={cols} height="75vh" position="sticky" zIndex={3} top={-1}>
			<Tbody>
				{(!timeRecords || timeRecords?.length === 0) && (
					<EmptyRowRecord data={timeRecords} colSpan={cols.length} />
				)}
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
							<Tr key={_id} h={"20px"} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
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
										title={startBreaks?.length ? getTimeCardFormat(startBreaks[0], notDevice) : ""}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={endBreaks?.length ? getTimeCardFormat(endBreaks[0], notDevice) : ""}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={
											startBreaks?.length > 1 ? getTimeCardFormat(startBreaks[1], notDevice) : ""
										}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={endBreaks?.length > 1 ? getTimeCardFormat(endBreaks[1], notDevice) : ""}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={
											startBreaks?.length > 2 ? getTimeCardFormat(startBreaks[2], notDevice) : ""
										}
									/>
								</Td>
								<Td p={0.5} pl={6}>
									<NormalTextTitle
										size={"sm"}
										title={endBreaks?.length > 2 ? getTimeCardFormat(endBreaks[2], notDevice) : ""}
									/>
								</Td>
								<Td p={0.5} pl={6} position={"sticky"} right={"0"} zIndex="1">
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
