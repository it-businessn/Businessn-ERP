import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { getTimeCardFormat } from "utils";

const sample = [
	{
		user_id: "7745",
		timestamp: "2024-09-28 16:21:25",
		status: "4",
		punch: "0",
	},
];

const Timecard = ({ cols, company, userId, timecardRefresh, filter }) => {
	const [timeRecords, setTimeRecords] = useState(null);
	// const [timecardEntries, setTimecardEntries] = useState([]);
	const fetchAllTimecards = async () => {
		try {
			const response = await TimesheetService.getTimecards();
			setTimeRecords(response.data);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchAllTimecards();
	}, []);

	useEffect(() => {
		const postAllTimecards = async (type) => {
			try {
				const response = await TimesheetService.addTimecard(sample);
				if (response) {
					fetchAllTimecards();
				}
			} catch (error) {
				console.error(error);
			}
		};
		if (timecardRefresh) {
			postAllTimecards();
		}
	}, [timecardRefresh]);

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
		<TableLayout isTimesheet cols={cols}>
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
					}) => {
						return (
							<Tr key={_id}>
								<Td py={0}>
									<TextTitle title={employeeName} />
								</Td>
								<Td>
									<TextTitle title={badge_id} />
								</Td>
								<Td py={1}>{clockIn && getTimeCardFormat(clockIn)}</Td>
								<Td py={1}>{clockOut && getTimeCardFormat(clockOut)}</Td>
								<Td py={1}>
									{startBreaks.length > 0
										? getTimeCardFormat(startBreaks[0])
										: ""}
								</Td>
								<Td py={1}>
									{endBreaks.length > 0 ? getTimeCardFormat(endBreaks[0]) : ""}
								</Td>
								<Td py={1}>
									{startBreaks.length > 1
										? getTimeCardFormat(startBreaks[1])
										: ""}
								</Td>
								<Td py={1}>
									{endBreaks.length > 1 ? getTimeCardFormat(endBreaks[1]) : ""}
								</Td>
								<Td py={1}>
									{startBreaks.length > 2
										? getTimeCardFormat(startBreaks[2])
										: ""}
								</Td>
								<Td py={1}>
									{endBreaks.length > 2 ? getTimeCardFormat(endBreaks[2]) : ""}
								</Td>
								<Td py={0}>{totalBreakHours}</Td>
							</Tr>
						);
					},
				)}
			</Tbody>
		</TableLayout>
	);
};

export default Timecard;
