import { HStack, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { COLS } from "constant";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { getTimeCardFormat } from "utils/convertDate";

const Timecard = ({ company, timecardRefresh, filter, pageNum, setPageNum }) => {
	const [totalPage, setTotalPages] = useState(1);
	const [timeRecords, setTimeRecords] = useState(null);
	const limit = 30;
	useEffect(() => {
		const fetchAllTimecards = async () => {
			try {
				const { data } = await TimesheetService.getTimecards(company, filter, {
					page: pageNum,
					limit,
				});
				const { totalPages, page, items } = data;
				setTimeRecords(items);
				setTotalPages(totalPages > 0 ? totalPages : 1);
				setPageNum(page);
			} catch (error) {
				console.error(error);
			}
		};
		if (filter?.startDate) fetchAllTimecards();
	}, [timecardRefresh, pageNum]);

	const cols = [
		COLS.EMP_NAME,
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
		<>
			<TableLayout cols={cols} height="72vh" position="sticky" zIndex={3} top={-1}>
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
											title={
												startBreaks?.length ? getTimeCardFormat(startBreaks[0], notDevice) : ""
											}
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
											title={
												endBreaks?.length > 1 ? getTimeCardFormat(endBreaks[1], notDevice) : ""
											}
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
											title={
												endBreaks?.length > 2 ? getTimeCardFormat(endBreaks[2], notDevice) : ""
											}
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
			<HStack>
				<PrimaryButton
					size="sm"
					isDisabled={pageNum === 1}
					name="Prev"
					onOpen={() => setPageNum(pageNum - 1)}
				/>

				<NormalTextTitle align="center" width="200px" title={`Page ${pageNum} of ${totalPage}`} />
				<PrimaryButton
					size="sm"
					isDisabled={pageNum === totalPage}
					name="Next"
					onOpen={() => setPageNum(pageNum + 1)}
				/>
			</HStack>
		</>
	);
};

export default Timecard;
