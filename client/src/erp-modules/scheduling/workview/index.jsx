import { Box, Flex, FormLabel, HStack, Icon, Select } from "@chakra-ui/react";
import ComingSoon from "components/ComingSoon";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { addDays, format, startOfWeek } from "date-fns";
import useCrews from "hooks/useCrews";
import usePositionRoles from "hooks/usePositionRoles";
import useWorkLocations from "hooks/useWorkLocations";
import PageLayout from "layouts/PageLayout";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import ShiftModal from "./quick-selection/ShiftModal";
import WeeklyCalendarView from "./WeeklyCalendarView";

const ScheduleWorkView = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const loggedInUser = LocalStorageService.getItem("user");
	const isUserManager = isManager(loggedInUser.role);

	const [timeFormat, setTimeFormat] = useState("12");
	const [view, setView] = useState("weekly");
	const [newShiftAdded, setNewShiftAdded] = useState(null);
	const [refresh, setRefresh] = useState(null);
	const [showAddShiftModal, setShowAddShiftModal] = useState(false);
	const [empName, setEmpName] = useState(null);
	const [empRole, setEmpRole] = useState(null);
	const [shift, setShift] = useState(null);
	const [employeesList, setEmployeesList] = useState(null);
	const { crews, selectedCrew, setSelectedCrew } = useCrews(company);
	const [location, setLocation] = useState(null);
	const [configCC, setConfigCC] = useState(null);
	// const [locations, setLocations] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState(null);
	const [selectedCC, setSelectedCC] = useState(null);
	const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

	const locations = useWorkLocations(company, refresh);
	const roles = usePositionRoles(company, refresh);

	useEffect(() => {
		if (selectedCrew) {
			const record = crews?.find((crew) => crew.name === selectedCrew);
			setConfigCC(record?.config?.costCenter);
			// setLocations(record?.config?.department);
			setEmployeesList(record?.config?.employee);
		}
		// else {
		// setLocations(data[0]?.config?.department);
		// setEmployeesList(data[0]?.config?.employee);
		// setConfigCC(data[0]?.config?.costCenter);
		// }
	}, [selectedCrew]);

	const handleChangeDate = (direction) => {
		setWeekStart((prev) => (direction === "prev" ? addDays(prev, -7) : addDays(prev, 7)));
	};

	return (
		<PageLayout title="WorkView">
			<Flex justify="space-between" align="center" mb={4}>
				<HStack justify="space-between">
					<HStack>
						<FormLabel>
							<TextTitle title="Crew" />
						</FormLabel>
						<Select
							value={selectedCrew || ""}
							onChange={(e) => {
								if (e.target.value) setSelectedCrew(e.target.value);
							}}
						>
							{crews?.map(({ _id, name }) => (
								<option key={_id} value={name}>
									{name}
								</option>
							))}
						</Select>
					</HStack>
					<HStack>
						<FormLabel>
							<TextTitle title="Time Format" />
						</FormLabel>
						<Select
							value={timeFormat}
							onChange={(e) => {
								const { value } = e.target;
								if (value) setTimeFormat(value);
							}}
							placeholder="Select time format"
						>
							<option value="12">12-hour</option>
							<option value="24">24-hour</option>
						</Select>
					</HStack>
				</HStack>

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

				{/* <Tabs variant="enclosed" onChange={(i) => setView(i === 0 ? "weekly" : "daily")} isLazy lazyBehavior="unmount">
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
					timeFormat={timeFormat}
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
		</PageLayout>
	);
};

export default ScheduleWorkView;
