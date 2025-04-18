import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Timeline, { CustomHeader, SidebarHeader, TimelineHeaders } from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendar } from "react-icons/ci";
// import { FaChevronDown } from "react-icons/fa";
import NormalTextTitle from "components/ui/NormalTextTitle";
import moment from "moment";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import SchedulerService from "services/SchedulerService";
import { getRoleColor } from "utils";
import { isSameAsToday, longFormat } from "utils/convertDate";
import Group from "./Group";
import ItemsRow from "./ItemsRow";
import "./Scheduler.css";

const SchedulingCalendar = ({ newShiftAdded, setRefresh, company }) => {
	const [currentDate, setCurrentDate] = useState(new Date());
	currentDate.setHours(6, 0, 0, 0);

	const eventInitialStartTime = new Date(currentDate);
	eventInitialStartTime.setHours(9, 0, 0, 0);
	const eventInitialEndTime = new Date(currentDate);
	eventInitialEndTime.setHours(17, 0, 0, 0);

	const eventPrevStartTime = new Date(currentDate);
	eventPrevStartTime.setHours(7, 0, 0, 0);
	const eventPrevEndTime = new Date(currentDate);
	eventPrevEndTime.setHours(8, 0, 0, 0);

	const yesterdayDate = new Date(currentDate);
	yesterdayDate.setDate(currentDate.getDate() - 1);
	const tomorrowDate = new Date(currentDate);
	tomorrowDate.setDate(currentDate.getDate() + 1);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const isToday = isSameAsToday(currentDate);

	const [groups, setGroups] = useState([]);
	const [items, setItems] = useState([]);

	useEffect(() => {
		const fetchShifts = async () => {
			try {
				const { data } = await SchedulerService.getWorkShiftsByDate({
					date: moment(),
					company,
				});
				const groupMap = new Map();
				data?.forEach(({ _id, empName, role }) => {
					if (!groupMap.has(empName)) {
						groupMap.set(empName, {
							id: empName,
							title: empName,
							color: getRoleColor(role),
						});
					}
				});
				const mappedGroups = Array.from(groupMap.values());
				setGroups(mappedGroups);

				const mappedItems = data?.map((shift, index) => {
					const dateStr = shift.shiftDate.split("T")[0];
					const start_time = moment(`${dateStr}T${shift.shiftStart}:00`);
					const end_time = moment(`${dateStr}T${shift.shiftEnd}:00`);

					return {
						id: `${shift.empName}-${index}`,
						group: shift.empName,
						title: shift.empName,
						start_time,
						end_time,
						canResize: false,
						color: getRoleColor(shift.role),
						duration: end_time.diff(start_time, "hours", true),
					};
				});
				setItems(mappedItems);
			} catch (error) {
				console.error(error);
			}
		};
		fetchShifts();
	}, [currentDate, company, newShiftAdded]);

	const groupRenderer = ({ group }) => <Group group={group} />;

	const itemRenderer = ({ item, itemContext, getItemProps }) => {
		return (
			<ItemsRow
				getItemProps={getItemProps}
				item={item}
				itemContext={itemContext}
				setRefresh={setRefresh}
			/>
		);
	};

	const handleChangeDate = (action) => {
		setCurrentDate((prevDate) => {
			const newDate = new Date(prevDate);
			if (action === "prev") {
				newDate.setDate(newDate.getDate() - 1); // Previous day
			} else if (action === "next") {
				newDate.setDate(newDate.getDate() + 1); // Next day
			}
			return newDate;
		});
	};

	return (
		<Box overflow={"auto"} w={"100%"}>
			<HStack
				justifyContent={"space-between"}
				fontWeight="bold"
				fontSize={"sm"}
				px="1em"
				mb={"0.5em"}
			>
				<Text>Schedule</Text>
				<HStack spacing={0}>
					<Icon
						as={MdOutlineChevronLeft}
						onClick={() => handleChangeDate("prev")}
						boxSize="5"
						color="fg.muted"
					/>
					<NormalTextTitle title={isToday ? "Today" : longFormat(currentDate)} />
					<Icon
						as={MdOutlineChevronRight}
						onClick={() => handleChangeDate("next")}
						boxSize="5"
						color="fg.muted"
					/>
				</HStack>
				<HStack cursor={"pointer"}>
					<Icon as={CiCalendar} boxSize="5" color="fg.muted" />
					<DatePicker
						style={{ bg: "red" }}
						selected={selectedDate}
						onChange={(date) => {
							setSelectedDate(date);
							setCurrentDate(date);
						}}
						dateFormat="dd, MMMM yyyy"
					/>
					{/* <Icon as={FaChevronDown} boxSize="3" color="fg.muted" /> */}
				</HStack>

				<Text fontWeight={"normal"}>
					Default duration:{" "}
					<Text as={"span"} fontWeight="bold">
						12 hours
					</Text>
				</Text>
			</HStack>
			{groups?.length && (
				<Timeline
					style={{
						zIndex: 0,
						position: "relative",
						borderRight: "1px solid var(--calendar_border)",
					}}
					groups={groups}
					items={items}
					defaultTimeStart={currentDate}
					defaultTimeEnd={new Date(currentDate.getTime() + 12 * 60 * 60 * 1000)} // 12 hours duration
					canMove={false}
					timeSteps={{
						minute: 15,
					}}
					itemRenderer={itemRenderer}
					viewMode="day"
					groupRenderer={groupRenderer}
				>
					<TimelineHeaders>
						<SidebarHeader>
							{({ getRootProps }) => (
								<Flex
									{...getRootProps()}
									w={"148px !important"}
									alignItems={"center"}
									justify={"center"}
									fontSize={"sm"}
									h={"28px"}
									borderLeft={"1px solid var(--calendar_border)"}
									borderTop={"1px solid var(--calendar_border)"}
								>
									<Text>Area 1</Text>
								</Flex>
							)}
						</SidebarHeader>
						<CustomHeader unit="hour">
							{({ headerContext: { intervals }, getRootProps, getIntervalProps, showPeriod }) => (
								<Box {...getRootProps()}>
									{intervals.map((interval) => (
										<Text
											key={interval.startTime}
											textAlign={"center"}
											borderLeft={"1px solid var(--calendar_border)"}
											borderTop={"1px solid var(--calendar_border)"}
											fontSize={{ base: "xs", md: "10px", lg: "sm" }}
											onClick={() => {
												// showPeriod(interval.startTime, interval.endTime);
											}}
											{...getIntervalProps({
												interval,
											})}
										>
											{interval.startTime.format("hh:mm A")}
										</Text>
									))}
								</Box>
							)}
						</CustomHeader>
					</TimelineHeaders>
				</Timeline>
			)}
		</Box>
	);
};

export default SchedulingCalendar;
