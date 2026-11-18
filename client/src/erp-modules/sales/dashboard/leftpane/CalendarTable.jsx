import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useGroup from "hooks/useGroup";
import useSelectUser from "hooks/useSelectUser";
import useSortableData from "hooks/useSortableData";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import CalendarService from "services/CalendarService";
import { formatDate } from "utils/convertDate";
import AddEvent from "../../calendar/AddEvent";
import LocalStorageService from "services/LocalStorageService";

// TABLE-SORT: the From / To cells show the (local) date followed by the time
const pad = (n) => String(n).padStart(2, "0");
const dateTimeSortValue = (date, time) => {
	if (!date) return null;
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return null;
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${time ?? ""}`.trim();
};
const byFrom = (item) => dateTimeSortValue(item.fromDate, item.fromTime);
const byTo = (item) => dateTimeSortValue(item.toDate, item.toTime);
// keys follow the cell order of each row
const SORT_KEYS_BY_INDEX = ["description", byFrom, byTo, "eventLink", "location"];

const CalendarTable = ({ cols, setIsRefresh, filterText, filter, setStats, user, company }) => {
	const [showEventForm, setShowEventForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState(null);
	const { sortedItems, sortConfig, requestSort } = useSortableData(data);
	const { selectedUser } = useSelectUser(user);
	const groups = useGroup(company, false, showEventForm);

	useEffect(() => {
		const fetchAllUserEvents = async () => {
			try {
				const { data } =
					filter === "event"
						? await CalendarService.getUserEventsByType({
								type: "event",
								name: selectedUser?.fullName,
								company,
						  })
						: filter === "meeting"
						? await CalendarService.getUserEventsByType({
								type: "meeting",
								name: selectedUser?.fullName,
								company,
						  })
						: await CalendarService.getUserEventsByType({
								type: "phoneCall",
								name: selectedUser?.fullName,
								company,
						  });
				setData(data);
				setStatInfo(filterText, data.length);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllUserEvents();
	}, [selectedUser]);

	const setStatInfo = (key, count) =>
		setStats((prevStats) =>
			prevStats.map((stat) => {
				if (stat.name === `${key}s`) {
					return { ...stat, value: count };
				}
				return stat;
			}),
		);

	return (
		<Box overflow="auto" fontWeight={"normal"} height="30vh" css={tabScrollCss}>
			<LeftIconButton name={"New"} handleClick={() => setShowEventForm(true)} icon={<BsPlus />} />

			{showEventForm && (
				<AddEvent
					filter={filter}
					filterText={filterText}
					isLoading={isLoading}
					isOpen={showEventForm}
					setIsLoading={setIsLoading}
					setIsRefresh={setIsRefresh}
					onClose={() => {
						setShowEventForm(false);
					}}
					groups={groups}
					// BUG-CAL-01: the dashboard opened "New" without the company and the user,
					// so the event was saved without them; like the calendar page, the
					// creator is the signed-in user
					company={company}
					user={LocalStorageService.getItem("user")}
				/>
			)}
			<Table variant={"simple"} size={"small"}>
				<Thead>
					<Tr>
						{cols?.map((col, index) =>
							col === "hideCol1" || col === "hideCol2" ? (
								<Th fontSize={"xs"} key={col} />
							) : (
								<SortableTh
									sortKey={SORT_KEYS_BY_INDEX[index]}
									sortConfig={sortConfig}
									onSort={requestSort}
									fontSize={"xs"}
									key={col}
									textAlign={
										col.includes("Link") || col.includes("Description") ? "left" : "center"
									}
								>
									{col}
								</SortableTh>
							),
						)}
					</Tr>
				</Thead>
				<Tbody>
					{(!data || data?.length === 0) && <EmptyRowRecord data={data} colSpan={cols?.length} />}
					{sortedItems?.map((item) => (
						<Tr key={item._id}>
							<Td pl={5} fontSize={"xs"} whiteSpace={"wrap"} width={"100px"}>
								{item.description}
							</Td>
							<Td textAlign={"center"} fontSize={"xs"} width={"50px"}>{`${formatDate(
								item.fromDate,
							)} ${item.fromTime}`}</Td>
							<Td textAlign={"center"} width={"50px"} fontSize={"xs"}>{`${formatDate(
								item.toDate,
							)} ${item.toTime}`}</Td>
							<Td fontSize={"xs"} whiteSpace={"wrap"} width={"100px"}>
								{item.eventLink}
							</Td>
							<Td fontSize={"xs"} width={"80px"} textAlign={"center"}>
								{item.location}
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default CalendarTable;
