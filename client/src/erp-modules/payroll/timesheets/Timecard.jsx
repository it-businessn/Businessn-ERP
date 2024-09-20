import { Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TableLayout from "components/ui/table/TableLayout";
import { useEffect, useState } from "react";

const Timecard = ({ cols, data }) => {
	const [timeRecords, setTimeRecords] = useState([
		{
			user_id: 6891115,
			timestamp: "2024-09-18 13:39:34",
			status: 4,
			punch: 0,
		},
		{
			user_id: 1,
			timestamp: "2024-09-18 13:43:02",
			status: 4,
			punch: 2,
		},
		{
			user_id: 1,
			timestamp: "2024-09-18 13:43:11",
			status: 4,
			punch: 3,
		},
		{
			user_id: 1,
			timestamp: "2024-09-18 13:43:27",
			status: 4,
			punch: 1,
		},
		{
			user_id: 1,
			timestamp: "2024-09-18 13:45:05",
			status: 3,
			punch: 0,
		},
		{
			user_id: 1,
			timestamp: "2024-09-18 13:46:22",
			status: 4,
			punch: 1,
		},
		{
			user_id: 2,
			timestamp: "2024-09-18 14:05:33",
			status: 3,
			punch: 0,
		},
		{
			user_id: 2,
			timestamp: "2024-09-18 14:06:06",
			status: 3,
			punch: 2,
		},
		{
			user_id: 2,
			timestamp: "2024-09-18 14:07:21",
			status: 3,
			punch: 3,
		},
		{
			user_id: 2,
			timestamp: "2024-09-18 14:07:44",
			status: 3,
			punch: 1,
		},
	]);
	const [timecardEntries, setTimecardEntries] = useState([]);
	useEffect(() => {
		const groupedData = [];
		timeRecords.forEach((record) => {
			let userGroup = groupedData.find(
				(group) => group.user_id === record.user_id,
			);
			if (
				!userGroup ||
				(record.punch === 1 &&
					userGroup.punches.find((punch) => punch.punch === 1))
			) {
				userGroup = { user_id: record.user_id, punches: [] };
				groupedData.push(userGroup);
			}
			userGroup.punches.push({
				timestamp: record.timestamp,
				status: record.status,
				punch: record.punch,
			});
		});
		const mappedData = [];
		groupedData.forEach((user) => {
			// Split punches into chunks of 4
			for (let i = 0; i < user.punches.length; i += 4) {
				mappedData.push({
					user_id: user.user_id,
					punches: user.punches.slice(i, i + 4),
				});
			}
		});
		setTimecardEntries(groupedData);
	}, [timeRecords]);
	return (
		<TableLayout isTimesheet cols={cols}>
			<Tbody>
				{!timeRecords?.length && <EmptyRowRecord />}
				{/* {data?.map(
					({
						_id,
						employeeId,
						approveStatus,
						payType,
						clockIns,
						clockOuts,
						startBreaks,
						endBreaks,
						regHoursWorked,
						overtimeHoursWorked,
						dblOvertimeHoursWorked,
						statDayHoursWorked,
						sickPayHours,
						statDayHours,
						vacationPayHours,
					}) => {
						const approveStatusBtnCss = getStatusStyle(approveStatus);

						const { param_hours } = getParamKey(payType);
						const param_hours_worked =
							param_hours === "regHoursWorked"
								? regHoursWorked
								: param_hours === "overtimeHoursWorked"
								? overtimeHoursWorked
								: param_hours === "dblOvertimeHoursWorked"
								? dblOvertimeHoursWorked
								: param_hours === "statDayHoursWorked"
								? statDayHoursWorked
								: param_hours === "statDayHours"
								? statDayHours
								: param_hours === "sickPayHours"
								? sickPayHours
								: vacationPayHours;

						const hhMMFormattedTime = `${(param_hours_worked / 60).toFixed(
							0,
						)}:${param_hours_worked % 60}`;
						return (
							<Tr key={_id}>
								<Td py={0}>
									<TextTitle title={employeeId?.fullName} />
								</Td>
								<Td>
									<TextTitle title={employeeId?.timeManagementBadgeID} />
								</Td>
								<Td py={0}>{clockIns.length > 0 ? clockIns[0] : ""}</Td>
								<Td py={0}>{clockOuts.length > 0 ? clockOuts[0] : ""}</Td>
								<Td py={0}>{startBreaks?.[0] ?? ""}</Td>
								<Td py={0}>{endBreaks?.[0] ?? ""}</Td>
								<Td py={0}>{startBreaks?.[1] ?? ""}</Td>
								<Td py={0}>{endBreaks?.[1] ?? ""}</Td>
								<Td py={0}>{startBreaks?.[2] ?? ""}</Td>
								<Td py={0}>{endBreaks?.[2] ?? ""}</Td>
								<Td py={0}>{hhMMFormattedTime}</Td>

								{/* <Td py={0}>
								{startBreaks.length > 0
									? startBreaks[startBreaks.length - 1]
									: ""}
							</Td>
							<Td py={0}>
								{endBreaks.length > 0 ? endBreaks[endBreaks.length - 1] : ""}
							</Td>
							<Td py={0}>
								{clockIns.length > 1 ? clockIns[clockIns.length - 1] : ""}
							</Td>
							<Td py={0}>
								{clockOuts.length > 1 ? clockIns[clockOuts.length - 1] : ""}
							</Td> 
							</Tr>
						);
					},
				)} */}

				{timecardEntries?.map(({ user_id, punches }) => {
					const clockIn = punches.find(({ punch }) => punch === 0);
					const clockOut = punches.find(({ punch }) => punch === 1);
					const breakIn = punches.find(({ punch }) => punch === 2);
					const breakOut = punches.find(({ punch }) => punch === 3);
					return (
						<Tr key={crypto.randomUUID()}>
							<Td py={0}>{"empname"}</Td>
							<Td py={0}>{user_id}</Td>
							<Td py={0}>{clockIn?.timestamp}</Td>
							<Td py={0}>{clockOut?.timestamp}</Td>
							<Td py={0}>{breakIn?.timestamp}</Td>
							<Td py={0}>{breakOut?.timestamp}</Td>
						</Tr>
					);
				})}
			</Tbody>
		</TableLayout>
	);
};

export default Timecard;
