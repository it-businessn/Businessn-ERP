import { SmallAddIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	HStack,
	Icon,
	IconButton,
	Select,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import ComingSoon from "components/ComingSoon";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { addDays, format, startOfWeek } from "date-fns";
import usePositionRoles from "hooks/usePositionRoles";
import PageLayout from "layouts/PageLayout";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";
import SchedulerService from "services/SchedulerService";
import SettingService from "services/SettingService";
import { isManager } from "utils";
import ShiftModal from "./quick-selection/ShiftModal";

const calculateHours = (shift) => {
	if (shift === "Off") return 0;
	const [start, end] = shift.split("-").map(Number);
	return end - start;
};

const ScheduleWorkView = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const loggedInUser = LocalStorageService.getItem("user");
	const isUserManager = isManager(loggedInUser.role);

	const [selectedCrew, setSelectedCrew] = useState(null);
	const [view, setView] = useState("weekly");
	const [newShiftAdded, setNewShiftAdded] = useState(null);
	const [refresh, setRefresh] = useState(null);
	const [showAddShiftModal, setShowAddShiftModal] = useState(false);
	const [empName, setEmpName] = useState(null);
	const [empRole, setEmpRole] = useState(null);
	const [shift, setShift] = useState(null);
	const [employeeShifts, setEmployeeShifts] = useState(null);
	const [employeesList, setEmployeesList] = useState(null);
	const roles = usePositionRoles(company, refresh);
	const [crews, setCrews] = useState(null);
	const [location, setLocation] = useState(null);
	const [configCC, setConfigCC] = useState(null);
	const [locations, setLocations] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState(null);
	const [selectedCC, setSelectedCC] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
	const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

	useEffect(() => {
		const fetchAllCrews = async () => {
			try {
				const { data } = await SettingService.getAllCrews(company);
				setCrews(data);
				setSelectedCrew(data[0]?.name);
				setConfigCC(data[0]?.config?.costCenter);
				setLocations(data[0]?.config?.department);
				setEmployeesList(data[0]?.config?.employee);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllCrews();
	}, [company]);

	useEffect(() => {
		const record = crews?.find((crew) => crew.name === selectedCrew);
		setConfigCC(record?.config?.costCenter);
		setLocations(record?.config?.department);
		setEmployeesList(record?.config?.employee);
	}, [selectedCrew]);

	useEffect(() => {
		const fetchShifts = async () => {
			setIsLoading(true);
			try {
				const { data } = await SchedulerService.getWorkWeekEmpShifts(
					weekStart,
					company,
					selectedCrew,
				);
				setEmployeeShifts(data);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(true);
			}
		};
		if (selectedCrew) fetchShifts();
	}, [newShiftAdded, weekStart, selectedCrew]);

	const handleChangeDate = (direction) => {
		setWeekStart((prev) => (direction === "prev" ? addDays(prev, -7) : addDays(prev, 7)));
	};

	const handleItemClick = (shiftDetail, shiftTime) => {
		setShowAddShiftModal(true);
		console.log("item", shiftDetail, shiftTime);
		// if (item) setShift(item);
	};
	return (
		<PageLayout title="WorkView">
			<Box p={4}>
				<Flex justify="space-between" align="center" mb={4}>
					<Flex align="center" gap={2}>
						<Text fontWeight="bold">Crew:</Text>
						<Select
							value={selectedCrew}
							onChange={(e) => setSelectedCrew(e.target.value)}
							width="150px"
						>
							{crews?.map(({ _id, name }) => (
								<option key={_id} value={name}>
									{name}
								</option>
							))}
						</Select>
					</Flex>

					<HStack spacing={0}>
						<Icon
							cursor="pointer"
							as={MdOutlineChevronLeft}
							onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
						<TextTitle
							size="lg"
							title={`
						${format(weekStart, "MMM d")} - ${format(addDays(weekStart, 6), "MMM d")}`}
						/>
						<Icon
							cursor="pointer"
							as={MdOutlineChevronRight}
							onClick={() => handleChangeDate("next")}
							boxSize="5"
							color="fg.muted"
						/>
					</HStack>

					{/* <Tabs variant="enclosed" onChange={(i) => setView(i === 0 ? "weekly" : "daily")}>
						<TabList>
							<Tab> */}
					<PrimaryButton name="Weekly View" />
					{/* </Tab>
							<Tab>
								<PrimaryButton
									name="
									Daily View"
								/>
							</Tab>
						</TabList> */}
					{/* </Tabs> */}
				</Flex>
				{view === "weekly" && (
					<Box overflowX="auto">
						<Table variant="simple">
							<Thead>
								<Tr>
									<Th py={2}>
										<TextTitle title="CUSTOM" />
									</Th>
									{weekDays.map((day, i) => (
										<Th py={2} key={i}>
											{format(day, "EEE dd")}
										</Th>
									))}
								</Tr>
							</Thead>
							<Tbody>
								{employeeShifts?.map((shiftRec) => (
									<Tr key={shiftRec?.name}>
										<Td py={2}>{shiftRec?.name}</Td>
										{shiftRec?.shifts?.map((shift, j) => (
											<Td py={0} key={j}>
												<HStack
													bg={"var(--bg_color_1)"}
													// bgColor={shift.color}
													px={"1"}
													py={0}
													spacing={0}
													justify={"space-between"}
												>
													<PrimaryButton
														hover={{
															color: "var(--main_color_black)",
															bg: !shift
																? "transparent"
																: shift === "Off"
																? "var(--bg_color_1)"
																: "var(--empName_bg)",
														}}
														color={
															shift === "Off" ? "var(--main_color_black)" : "var(--empName_bg)"
														}
														bg={shift === "Off" ? "var(--bg_color_1)" : "transparent"}
														name={
															!shift
																? ""
																: shift === "Off"
																? "Off"
																: `${shift} ${shiftRec?.role} @ ${shiftRec?.location}`
														}
													/>
													<IconButton
														size={"xs"}
														icon={<SmallAddIcon />}
														aria-label="Open Sidebar"
														_hover={{ bg: "transparent" }}
														onClick={() => {
															handleItemClick(shiftRec, shift);
														}}
													/>
												</HStack>
											</Td>
										))}
									</Tr>
								))}
								<Tr fontWeight="bold" bg="gray.100">
									<Td py={0}>Total Hours</Td>
									{weekDays.map((_, dayIdx) => {
										const total =
											employeeShifts?.reduce((sum, emp) => {
												if (!emp.shifts || !emp.shifts[0]) return sum;
												return sum + calculateHours(emp.shifts[dayIdx]);
											}, 0) ?? 0;

										return (
											<Td py={2} key={dayIdx}>
												{total}
											</Td>
										);
									})}
								</Tr>
								<Tr fontWeight="bold" bg="gray.100">
									<Td py={0}>Total Wages</Td>
									{weekDays.map((_, dayIdx) => {
										const total =
											employeeShifts?.reduce((sum, emp) => {
												if (!emp.shifts || !emp.shifts[0]) return sum;
												return sum + calculateHours(emp.shifts[dayIdx]);
											}, 0) ?? 0;

										return (
											<Td py={2} key={dayIdx}>
												{total}
											</Td>
										);
									})}
								</Tr>
							</Tbody>
						</Table>
					</Box>
				)}
				{view === "daily" && (
					<Box mt={4} textAlign="center">
						<ComingSoon message="Daily view coming soon" />
					</Box>
				)}
				{showAddShiftModal && (
					<ShiftModal
						currentDate={moment().format("YYYY-MM-DD")}
						roles={roles}
						employees={employeesList}
						locations={locations}
						location={location}
						company={company}
						showModal={showAddShiftModal}
						setShowModal={setShowAddShiftModal}
						setIsRefresh={setRefresh}
						setNewShiftAdded={setNewShiftAdded}
						empName={empName}
						empRole={empRole}
						shift={shift}
					/>
				)}
			</Box>
		</PageLayout>
	);
};

export default ScheduleWorkView;
