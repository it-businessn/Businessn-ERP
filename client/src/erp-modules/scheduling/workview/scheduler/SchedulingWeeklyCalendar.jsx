// import { Box, Flex, Text } from "@chakra-ui/react";
// import moment from "moment";
// import Timeline, { CustomHeader, SidebarHeader, TimelineHeaders } from "react-calendar-timeline";
// import "react-calendar-timeline/lib/Timeline.css";
// import "react-datepicker/dist/react-datepicker.css";
// // import { FaChevronDown } from "react-icons/fa";
// import TextTitle from "components/ui/text/TextTitle";
// import Group from "./Group";
// import ItemsRow from "./ItemsRow";
// import "./Scheduler.css";

// const SchedulingWeeklyCalendar = ({
// 	newShiftAdded,
// 	setRefresh,
// 	company,
// 	location,
// 	empName,
// 	currentDate,
// 	setCurrentDate,
// 	isUserManager,
// 	handleItemClick,
// }) => {
// 	const startOfWeek = moment().startOf("isoWeek");
// 	const endOfWeek = moment().endOf("isoWeek");
// 	const groupRenderer = ({ group }) => <Group group={group} />;
// 	const itemRenderer = ({ item, itemContext, getItemProps }) => {
// 		return (
// 			<ItemsRow
// 				getItemProps={getItemProps}
// 				item={item}
// 				itemContext={itemContext}
// 				setRefresh={setRefresh}
// 				handleItemClick={handleItemClick}
// 			/>
// 		);
// 	};
// 	return (
// 		<Box overflow={"auto"} w={"100%"}>
// 			<Timeline
// 				style={{
// 					zIndex: 0,
// 					position: "relative",
// 					borderRight: "1px solid var(--calendar_border)",
// 				}}
// 				groups={groups}
// 				items={items}
// 				defaultTimeStart={startOfWeek}
// 				defaultTimeEnd={endOfWeek}
// 				// visibleTimeStart={startOfWeek.valueOf()}
// 				// visibleTimeEnd={endOfWeek.valueOf()}
// 				canMove={false}
// 				timeSteps={{ day: 1 }}
// 				itemRenderer={itemRenderer}
// 				viewMode="week"
// 				groupRenderer={groupRenderer}
// 				itemTimeStartField="start_time"
// 				itemTimeEndField="end_time"
// 				itemHeightRatio={0.75}
// 				canResize={false}
// 				stackItems
// 			>
// 				<TimelineHeaders>
// 					<SidebarHeader>
// 						{({ getRootProps }) => (
// 							<Flex
// 								{...getRootProps()}
// 								w={"148px !important"}
// 								alignItems={"center"}
// 								justify={"center"}
// 								fontSize={"sm"}
// 								h={"28px"}
// 								borderLeft={"1px solid var(--calendar_border)"}
// 								borderTop={"1px solid var(--calendar_border)"}
// 							>
// 								<TextTitle size="sm" title="CUSTOM" />
// 							</Flex>
// 						)}
// 					</SidebarHeader>
// 					<CustomHeader unit="day">
// 						{({ headerContext: { intervals }, getRootProps, getIntervalProps, showPeriod }) => (
// 							<Box {...getRootProps()}>
// 								{intervals.map((interval, index) => (
// 									<Text
// 										key={`${interval.startTime}_${index}`}
// 										textAlign={"center"}
// 										borderLeft={"1px solid var(--calendar_border)"}
// 										borderTop={"1px solid var(--calendar_border)"}
// 										fontSize={{ base: "xs", md: "10px", lg: "sm" }}
// 										onClick={() => {
// 											// showPeriod(interval.startTime, interval.endTime);
// 										}}
// 										{...getIntervalProps({
// 											interval,
// 										})}
// 									>
// 										{interval.startTime.format("ddd")}
// 									</Text>
// 								))}
// 							</Box>
// 						)}
// 					</CustomHeader>
// 				</TimelineHeaders>
// 			</Timeline>
// 		</Box>
// 	);
// };

// export default SchedulingWeeklyCalendar;
