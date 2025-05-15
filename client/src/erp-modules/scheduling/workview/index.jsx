import { Box, Flex, HStack, Icon, Select, Text } from "@chakra-ui/react";
import ComingSoon from "components/ComingSoon";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { addDays, format, startOfWeek } from "date-fns";
import usePositionRoles from "hooks/usePositionRoles";
import useWorkLocations from "hooks/useWorkLocations";
import PageLayout from "layouts/PageLayout";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import { isManager } from "utils";
import ShiftModal from "./quick-selection/ShiftModal";
import WeeklyCalendarView from "./WeeklyCalendarView";

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
	const [employeesList, setEmployeesList] = useState(null);
	const [crews, setCrews] = useState(null);
	const [location, setLocation] = useState(null);
	const [configCC, setConfigCC] = useState(null);
	// const [locations, setLocations] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState(null);
	const [selectedCC, setSelectedCC] = useState(null);
	const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

	const locations = useWorkLocations(company, refresh);
	const roles = usePositionRoles(company, refresh);

	useEffect(() => {
		const fetchAllCrews = async () => {
			try {
				const { data } = await SettingService.getAllCrews(company);
				setCrews(data);
				setSelectedCrew(data[0]?.name);
				setConfigCC(data[0]?.config?.costCenter);
				// setLocations(data[0]?.config?.department);
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
		// setLocations(record?.config?.department);
		setEmployeesList(record?.config?.employee);
	}, [selectedCrew]);

	const handleChangeDate = (direction) => {
		setWeekStart((prev) => (direction === "prev" ? addDays(prev, -7) : addDays(prev, 7)));
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
					<WeeklyCalendarView
						weekStart={weekStart}
						company={company}
						selectedCrew={selectedCrew}
						newShiftAdded={newShiftAdded}
						setShowAddShiftModal={setShowAddShiftModal}
						setShift={setShift}
					/>
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
						crew={selectedCrew}
					/>
				)}
			</Box>
		</PageLayout>
	);
};

export default ScheduleWorkView;
