import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Timeline, { CustomHeader, SidebarHeader, TimelineHeaders } from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendar } from "react-icons/ci";
// import { FaChevronDown } from "react-icons/fa";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import SchedulerService from "services/SchedulerService";
import { getMomentDateISO, isSameAsToday, longFormat } from "utils/convertDate";
import Group from "./Group";
import ItemsRow from "./ItemsRow";
import "./Scheduler.css";

const SchedulingCalendar = ({ newEmployeeAdded, setRefresh, company }) => {
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

	const [groups, setGroups] = useState([{ id: 1, title: "Drop here", color: "transparent" }]);

	const [items, setItems] = useState([]);

	const onItemResize = (itemId, time, edge) => {
		const updatedItems = items.map((item) =>
			item.id === itemId
				? edge === "left"
					? {
							...item,
							start_time: new Date(time),
							duration: (item.end_time.getTime() - new Date(time).getTime()) / (1000 * 60 * 60),
					  }
					: {
							...item,
							end_time: new Date(time),
							duration: (new Date(time).getTime() - item.start_time.getTime()) / (1000 * 60 * 60),
					  }
				: item,
		);

		const updatedItem = updatedItems.find((item) => item.id === itemId);

		if (updatedItem) {
			const updateShifts = async () => {
				try {
					await SchedulerService.updateShift(updatedItem, updatedItem._id);
				} catch (error) {
					console.error(error);
				}
			};
			updateShifts();
		}

		setItems(updatedItems);
	};

	useEffect(() => {
		const fetchShifts = async () => {
			try {
				const { data } = await SchedulerService.getShiftsByDate({
					date: getMomentDateISO(currentDate),
					company,
				});
				const uniqueEvents = [];
				if (data.length > 0) {
					const titles = {};

					data.map((item) => {
						const startDate = new Date(item.start_time);
						const hoursFromStartDate = startDate.getUTCHours();
						const endDate = new Date(item.end_time);
						const hoursFromEndDate = endDate.getUTCHours();
						item.start_time = new Date(startDate.setUTCHours(hoursFromStartDate, 0, 0, 0));
						item.end_time = new Date(endDate.setUTCHours(hoursFromEndDate, 0, 0, 0));
						if (item.id.endsWith("s")) {
							titles[item.title] = true;
						} else {
							uniqueEvents.push(item);
						}
						// if (!titles[item.title] && !item.id.endsWith("s")) {
						// 	titles[item.title] = true;
						// 	uniqueEvents.push(item);
						// }
						return item;
					});
					uniqueEvents.sort((a, b) => {
						if (a.title < b.title) return -1;
						if (a.title > b.title) return 1;
						return 0;
					});
				}
				setGroups(uniqueEvents);

				setItems(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchShifts();
	}, [currentDate, company]);

	useEffect(() => {
		if (newEmployeeAdded) {
			// handleHourDrop(newEmployeeAdded);
		}
	}, [newEmployeeAdded]);

	const handleHourDrop = (employee) => {
		const { id, name, color } = employee;
		if (!id) {
			return;
		}
		const existingGroup = groups.find((item) => item.id === id);
		if (!existingGroup) {
			const newGroup = { id, title: name, color };
			groups.sort((a, b) => {
				if (a.title < b.title) return -1;
				if (a.title > b.title) return 1;
				return 0;
			});
			setGroups([...groups, newGroup]);
		}

		const existingItem = items.find((item) => item.group === id);
		const start_time = existingItem ? eventPrevStartTime : eventInitialStartTime;
		const end_time = existingItem ? eventPrevEndTime : eventInitialEndTime;

		const newItem = {
			id: existingItem ? `${id + 1}s` : id,
			group: id,
			title: name,
			color,
			start_time,
			end_time,
			duration: (end_time.getTime() - start_time.getTime()) / (1000 * 60 * 60),
		};

		if (newItem) {
			const newRecord = newItem;
			newRecord.company = company;
			const addShifts = async () => {
				try {
					await SchedulerService.addShifts(newRecord);
				} catch (error) {
					console.error(error);
				}
			};
			addShifts();
		}
		setItems([...items, newItem]);
	};

	const groupRenderer = ({ group }) => <Group group={group} handleHourDrop={handleHourDrop} />;

	const itemRenderer = ({ item, itemContext, getItemProps, getResizeProps }) => {
		return (
			<ItemsRow
				getItemProps={getItemProps}
				item={item}
				itemContext={itemContext}
				getResizeProps={getResizeProps}
				setRefresh={setRefresh}
			/>
		);
	};

	const yesterdayDate = new Date(currentDate);
	yesterdayDate.setDate(currentDate.getDate() - 1);
	const tomorrowDate = new Date(currentDate);
	tomorrowDate.setDate(currentDate.getDate() + 1);
	const [selectedDate, setSelectedDate] = useState(new Date());

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
	const isToday = isSameAsToday(currentDate);

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
				canResize="both"
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
		</Box>
	);
};

export default SchedulingCalendar;
