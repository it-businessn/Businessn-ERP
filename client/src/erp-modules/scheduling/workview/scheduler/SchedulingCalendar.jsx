import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Timeline, { CustomHeader, SidebarHeader, TimelineHeaders } from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendar } from "react-icons/ci";
// import { FaChevronDown } from "react-icons/fa";
import SkeletonLoader from "components/SkeletonLoader";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import moment from "moment";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import SchedulerService from "services/SchedulerService";
import { getRoleColor } from "utils";
import Group from "./Group";
import ItemsRow from "./ItemsRow";
import "./Scheduler.css";

const SchedulingCalendar = ({
	newShiftAdded,
	setRefresh,
	company,
	location,
	empName,
	currentDate,
	setCurrentDate,
	isUserManager,
	handleItemClick,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [groups, setGroups] = useState([]);
	const [items, setItems] = useState([]);

	useEffect(() => {
		setIsLoading(false);
	}, [items, groups]);

	useEffect(() => {
		const fetchShifts = async () => {
			try {
				setIsLoading(true);
				const { data } = await SchedulerService.getWorkShiftsByDate({
					date: currentDate,
					location,
					company,
					empName,
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

					shift.id = `${shift.empName}-${index}`;
					shift.group = shift.empName;
					shift.title = shift.empName;
					shift.start_time = start_time;
					shift.end_time = end_time;
					shift.canResize = false;
					shift.color = getRoleColor(shift.role);
					shift.duration = end_time.diff(start_time, "hours", true).toFixed(2);
					return shift;
				});
				setItems(mappedItems);
			} catch (error) {
				console.error(error);
			}
		};

		const fetchEmpShifts = async () => {
			try {
				setIsLoading(true);
				const { data } = await SchedulerService.getEmpWorkShiftsByDate({
					// date: currentDate,
					location,
					company,
					empName,
				});
				const groupMap = new Map();
				data?.forEach(({ _id, empName, shiftDate, role }) => {
					const dateStr = shiftDate.split("T")[0];
					const groupKey = `${empName}-${dateStr}`;

					if (!groupMap.has(groupKey)) {
						groupMap.set(groupKey, {
							id: groupKey,
							title: dateStr,
							color: getRoleColor(role),
						});
					}
				});
				const mappedGroups = Array.from(groupMap.values());
				setGroups(mappedGroups);

				const mappedItems = data?.map((shift, index) => {
					const dateStr = shift.shiftDate.split("T")[0];
					const groupKey = `${shift.empName}-${dateStr}`;

					const start_time = moment(`${dateStr}T${shift.shiftStart}:00`);
					const end_time = moment(`${dateStr}T${shift.shiftEnd}:00`);

					shift.id = shift._id;
					shift.group = groupKey;
					shift.title = shift.empName.trim();
					shift.start_time = start_time;
					shift.end_time = end_time;
					shift.color = getRoleColor(shift.role);
					shift.duration = end_time.diff(start_time, "hours", true).toFixed(2);
					return shift;
				});
				setItems(mappedItems);
			} catch (error) {
				console.error(error);
			}
		};
		if (location && isUserManager) {
			fetchShifts();
		} else {
			fetchEmpShifts();
		}
	}, [currentDate, company, newShiftAdded, location, empName]);

	const groupRenderer = ({ group }) => <Group group={group} />;

	const itemRenderer = ({ item, itemContext, getItemProps }) => {
		return (
			<ItemsRow
				getItemProps={getItemProps}
				item={item}
				itemContext={itemContext}
				setRefresh={setRefresh}
				handleItemClick={handleItemClick}
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
		<Box overflow={"auto"} w={"100%"} css={tabScrollCss}>
			<HStack
				justifyContent={"space-between"}
				fontWeight="bold"
				fontSize={"sm"}
				px="1em"
				mb={"0.5em"}
			>
				<Text>Schedule</Text>
				{isUserManager && (
					<HStack spacing={0}>
						<Icon
							cursor="pointer"
							as={MdOutlineChevronLeft}
							onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
						<HStack cursor={"pointer"}>
							<Icon as={CiCalendar} boxSize="5" color="fg.muted" />
							<DatePicker
								style={{ bg: "red" }}
								selected={currentDate}
								onChange={(date) => {
									setCurrentDate(date);
								}}
								dateFormat="dd, MMMM yyyy"
							/>
						</HStack>
						<Icon
							cursor="pointer"
							as={MdOutlineChevronRight}
							onClick={() => handleChangeDate("next")}
							boxSize="5"
							color="fg.muted"
						/>
					</HStack>
				)}

				<Text fontWeight={"normal"}>
					Default duration:{" "}
					<Text as={"span"} fontWeight="bold">
						12 hours
					</Text>
				</Text>
			</HStack>
			{isLoading && <SkeletonLoader />}
			{!isLoading && groups?.length && items?.length ? (
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
					itemTimeStartField="start_time"
					itemTimeEndField="end_time"
					itemHeightRatio={0.75}
					canResize={false}
					stackItems
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
									{intervals.map((interval, index) => (
										<Text
											key={`${interval.startTime}_${index}`}
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
			) : (
				<NormalTextTitle p="0 1em" width="15%" size="sm" title="No shifts found" />
			)}
		</Box>
	);
};

export default SchedulingCalendar;
