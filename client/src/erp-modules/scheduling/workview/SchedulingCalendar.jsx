import { SmallAddIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	IconButton,
	Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Timeline, {
	CustomHeader,
	SidebarHeader,
	TimelineHeaders,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDrop } from "react-dnd";
import { CiCalendar } from "react-icons/ci";
// import { FaChevronDown } from "react-icons/fa";
import moment from "moment";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import SchedulerService from "services/SchedulerService";
import "./Scheduler.css";

const SchedulingCalendar = ({ newEmployeeAdded }) => {
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

	const [{ isOver }, drop] = useDrop({
		accept: "employee",
		drop: (item) => handleHourDrop(item),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	});

	const [groups, setGroups] = useState([
		{ id: 1, title: "Drop here", color: "transparent" },
	]);

	const [items, setItems] = useState([]);
	// const onItemMove = (itemId, dragTime, newGroupOrder) => {
	// 	const updatedItems = items.map((item) =>
	// 		item.id === itemId
	// 			? {
	// 					...item,
	// 					start_time: dragTime,
	// 					end_time: new Date(
	// 						dragTime.getTime() + (item.end_time - item.start_time),
	// 					),
	// 					group: newGroupOrder,
	// 			  }
	// 			: item,
	// 	);
	// 	setItems(updatedItems);
	// };

	const onItemResize = (itemId, time, edge) => {
		const updatedItems = items.map((item) =>
			item.id === itemId
				? edge === "left"
					? {
							...item,
							start_time: new Date(time),
							duration:
								(item.end_time.getTime() - new Date(time).getTime()) /
								(1000 * 60 * 60),
					  }
					: {
							...item,
							end_time: new Date(time),
							duration:
								(new Date(time).getTime() - item.start_time.getTime()) /
								(1000 * 60 * 60),
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
				const response = await SchedulerService.getShiftsByDate(currentDate);
				console.log(response.data);
				if (response.data.length > 0) {
					const uniqueEvents = [];
					const titles = {};

					response.data.map((item) => {
						const startDate = new Date(item.start_time);
						const hoursFromStartDate = startDate.getUTCHours();
						const endDate = new Date(item.end_time);
						const hoursFromEndDate = endDate.getUTCHours();
						item.start_time = new Date(
							startDate.setUTCHours(hoursFromStartDate, 0, 0, 0),
						);
						item.end_time = new Date(
							endDate.setUTCHours(hoursFromEndDate, 0, 0, 0),
						);
						if (!titles[item.title] && !item.id.endsWith("s")) {
							titles[item.title] = true;
							uniqueEvents.push(item);
						}
						return item;
					});
					uniqueEvents.sort((a, b) => {
						if (a.title < b.title) return -11;
						if (a.title > b.title) return 1;
						return 0;
					});
					setGroups(uniqueEvents);

					setItems(response.data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchShifts();
	}, [currentDate]);

	useEffect(() => {
		if (newEmployeeAdded) {
			handleHourDrop(newEmployeeAdded);
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
		const start_time = existingItem
			? eventPrevStartTime
			: eventInitialStartTime;
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
			const addShifts = async () => {
				try {
					await SchedulerService.addShifts(newItem);
				} catch (error) {
					console.error(error);
				}
			};
			addShifts();
		}
		setItems([...items, newItem]);
	};

	const groupRenderer = ({ group }) => {
		return group.id ? (
			<Text
				className="custom-group"
				ref={drop}
				fontSize={"sm"}
				border={isOver && "2px solid #ccc"}
				bgColor={isOver ? "green.100" : "transparent"}
				onDrop={handleHourDrop}
			>
				{group.title}
			</Text>
		) : (
			<></>
		);
	};

	const itemRenderer = ({
		item,
		itemContext,
		getItemProps,
		getResizeProps,
	}) => {
		const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
		const durationText = item.duration < 2 ? "hour" : "hours";
		return (
			<Box {...getItemProps(item.itemProps)} w={"auto"}>
				{itemContext.useResizeHandle ? (
					<Box w={"auto"} {...leftResizeProps} />
				) : (
					""
				)}
				<HStack
					maxHeight={itemContext.dimensions.height}
					bgColor={item.color}
					borderRadius={"50px"}
					px={"1"}
					py={0}
					spacing={0}
					justify={"space-between"}
				>
					<Avatar size={"xs"} name={itemContext.title} />
					<Button variant="ghost" size="xs" color={"var(--bg_color_1)"}>
						{`${item.duration} ${durationText}`}
					</Button>
					<IconButton
						size={"xs"}
						icon={<SmallAddIcon />}
						aria-label="Open Sidebar"
						_hover={{ bg: "transparent" }}
						// onClick={() => onOpen()}
					/>
				</HStack>

				{itemContext.useResizeHandle ? (
					<Box w={"auto"} {...rightResizeProps} />
				) : (
					""
				)}
			</Box>
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
	const isToday = moment(currentDate).isSame(new Date(), "day");

	return (
		<Box overflow={"auto"} w={"100%"}>
			<Box
				color={"brand.200"}
				px="1em"
				mb={"1em"}
				borderRadius="10px"
				fontWeight="bold"
			>
				<HStack justifyContent={"space-between"} w={"100%"}>
					<Text>Schedule</Text>
					<HStack>
						<Icon
							as={MdOutlineChevronLeft}
							onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
						<Text>
							{isToday
								? "Today"
								: moment(currentDate).format("dddd, D MMMM YYYY")}
						</Text>
						<Icon
							as={MdOutlineChevronRight}
							onClick={() => handleChangeDate("next")}
							boxSize="5"
							color="fg.muted"
						/>
					</HStack>
					<HStack w="180px" cursor={"pointer"}>
						<Icon as={CiCalendar} boxSize="5" color="fg.muted" />
						<DatePicker
							style={{ bg: "red" }}
							selected={selectedDate}
							onChange={(date) => setSelectedDate(date)}
							dateFormat="dd, MMMM yyyy"
						/>
						{/* <Icon as={FaChevronDown} boxSize="3" color="fg.muted" /> */}
					</HStack>

					<Text fontWeight={"normal"}>
						Default duration:{" "}
						<Text as={"span"} fontWeight="bold">
							60 minutes
						</Text>
					</Text>
				</HStack>
			</Box>
			<Timeline
				style={{ zIndex: 0, position: "relative" }}
				groups={groups}
				items={items}
				defaultTimeStart={currentDate}
				defaultTimeEnd={new Date(currentDate.getTime() + 12 * 60 * 60 * 1000)} // 12 hours duration
				onItemResize={onItemResize}
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
								fontSize={"sm"}
								{...getRootProps()}
								alignItems={"center"}
								justify={"center"}
							>
								Area 1
							</Flex>
						)}
					</SidebarHeader>
					<CustomHeader unit="hour">
						{({
							headerContext: { intervals },
							getRootProps,
							getIntervalProps,
							showPeriod,
						}) => (
							<Box {...getRootProps()}>
								{intervals.map((interval) => (
									<Text
										key={interval.startTime}
										textAlign={"center"}
										border={"none"}
										fontSize={"sm"}
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
