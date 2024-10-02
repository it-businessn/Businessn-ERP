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
	// const [timecardEntries, setTimecardEntries] = useState([]);
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

	// useEffect(() => {
	// 	const postAllTimecards = async (type) => {
	// 		try {
	// 			const response = await TimesheetService.addTimecard(sample);
	// 			if (response) {
	// 				fetchAllTimecards();
	// 			}
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	};
	// 	if (timecardRefresh) {
	// 		postAllTimecards();
	// 	}
	// }, [timecardRefresh]);

	// useEffect(() => {
	// 	const groupedData = [];
	// 	timeRecords?.forEach((record) => {
	// 		let sameUser = groupedData
	// 			.slice()
	// 			.reverse()
	// 			.find((user) => user.user_id === record.user_id);
	// 		if (
	// 			!sameUser ||
	// 			(record.punch === "0" &&
	// 				sameUser.punches.find((punch) => punch.punch === "0"))
	// 		) {
	// 			sameUser = {
	// 				user_id: record.user_id,
	// 				punches: [],
	// 				employeeName: record?.employeeName ?? "",
	// 			};
	// 			groupedData.push(sameUser);
	// 		}
	// 		sameUser.punches.push({
	// 			timestamp: record.timestamp,
	// 			status: record.status,
	// 			punch: record.punch,
	// 		});
	// 	});
	// 	const mappedData = [];
	// 	groupedData.forEach((user) => {
	// 		// Split punches into chunks of 4
	// 		for (let i = 0; i < user.punches.length; i += 4) {
	// 			mappedData.push({
	// 				user_id: user.user_id,
	// 				punches: user.punches.slice(i, i + 4),
	// 			});
	// 		}
	// 	});
	// 	groupedData?.map((record) => {
	// 		const { punches } = record;
	// 		record.clockIn = punches.find(({ punch }) => punch === "0")?.timestamp;
	// 		record.clockOut = punches.find(({ punch }) => punch === "1")?.timestamp;
	// 		record.breakIn = punches.find(({ punch }) => punch === "2")?.timestamp;
	// 		record.breakOut = punches.find(({ punch }) => punch === "3")?.timestamp;
	// 		return record;
	// 	});
	// 	// console.log(groupedData);
	// 	setTimecardEntries(groupedData);
	// }, [timeRecords]);
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
