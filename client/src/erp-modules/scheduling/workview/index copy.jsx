import { SimpleGrid } from "@chakra-ui/react";
import usePositionRoles from "hooks/usePositionRoles";
import PageLayout from "layouts/PageLayout";
import moment from "moment";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import { isManager } from "utils";
import HeaderCards from "./HeaderCards";
import QuickSelection from "./quick-selection";
import ShiftModal from "./quick-selection/ShiftModal";
import Scheduler from "./scheduler";

const ScheduleWorkView = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const loggedInUser = LocalStorageService.getItem("user");
	const isUserManager = isManager(loggedInUser.role);

	// const locations = useWorkLocations(company, refresh);
	// const [employees, setEmployees] = useState(null);
	const [newShiftAdded, setNewShiftAdded] = useState(null);
	const [refresh, setRefresh] = useState(null);
	const [showAddShiftModal, setShowAddShiftModal] = useState(false);
	const [empName, setEmpName] = useState(null);
	const [empRole, setEmpRole] = useState(null);
	const [shift, setShift] = useState(null);
	const [selectedEmp, setSelectedEmp] = useState(isUserManager ? null : loggedInUser?.fullName);
	const [employeesList, setEmployeesList] = useState(null);
	const roles = usePositionRoles(company, refresh);
	const [crews, setCrews] = useState(null);
	const [location, setLocation] = useState(null);
	const [configCC, setConfigCC] = useState(null);
	const [locations, setLocations] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState(null);
	const [selectedCC, setSelectedCC] = useState(null);
	const [currentDate, setCurrentDate] = useState(new Date());
	currentDate.setHours(6, 0, 0, 0);

	useEffect(() => {
		const fetchAllCrews = async () => {
			try {
				const { data } = await SettingService.getAllCrews(company);
				setCrews(data);
				setSelectedFilter(data[0]?.name);
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
		const record = crews?.find((crew) => crew.name === selectedFilter);
		setConfigCC(record?.config?.costCenter);
		setLocations(record?.config?.department);
		setEmployeesList(record?.config?.employee);
	}, [selectedFilter]);

	const handleShift = (empId, name, color, role) => {
		setShowAddShiftModal(true);
		setEmpName(name);
		setEmpRole(role);
		setShift(null);
	};
	const clearFilter = () => {
		setSelectedEmp(null);
	};
	const handleItemClick = (item) => {
		setShowAddShiftModal(true);
		setShift(item);
	};
	return (
		<PageLayout title="WorkView">
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1, md: 3 }}
				spacing="1em"
				color={"var(--menu_item_color)"}
			>
				<HeaderCards />
			</SimpleGrid>
			{isUserManager ? (
				<SimpleGrid
					columns={{ base: 1, md: 1, lg: 2 }}
					spacing="4"
					mt="4"
					templateColumns={{ lg: "20% 80%" }}
				>
					<QuickSelection
						crews={crews}
						selectedFilter={selectedFilter}
						setSelectedFilter={setSelectedFilter}
						selectedCC={selectedCC}
						setSelectedCC={setSelectedCC}
						configCC={configCC}
					/>
					<Scheduler locations={locations} setLocation={setLocation} location={location} />
				</SimpleGrid>
			) : (
				<Scheduler locations={locations} setLocation={setLocation} location={location} />
			)}
			{showAddShiftModal && (
				<ShiftModal
					currentDate={moment(currentDate).format("YYYY-MM-DD")}
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
		</PageLayout>
	);
};

export default ScheduleWorkView;
