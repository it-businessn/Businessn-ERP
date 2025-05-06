import { SimpleGrid } from "@chakra-ui/react";
import useCompany from "hooks/useCompany";
import usePositionRoles from "hooks/usePositionRoles";
import useWorkLocations from "hooks/useWorkLocations";
import PageLayout from "layouts/PageLayout";
import moment from "moment";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { getRoleColor, isManager } from "utils";
import HeaderCards from "./HeaderCards";
import QuickSelection from "./quick-selection";
import ShiftModal from "./quick-selection/ShiftModal";
import Scheduler from "./scheduler";

const ScheduleWorkView = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const isUserManager = isManager(loggedInUser.role);
	const [newShiftAdded, setNewShiftAdded] = useState(null);
	const [employees, setEmployees] = useState(null);
	const [refresh, setRefresh] = useState(null);
	const [showAddShiftModal, setShowAddShiftModal] = useState(false);
	const [empName, setEmpName] = useState(null);
	const [empRole, setEmpRole] = useState(null);
	const [shift, setShift] = useState(null);
	const [selectedEmp, setSelectedEmp] = useState(isUserManager ? null : loggedInUser?.fullName);
	const locations = useWorkLocations(company, refresh);
	const [employeesList, setEmployeesList] = useState(null);
	const roles = usePositionRoles(company, refresh);
	const [location, setLocation] = useState(null);
	const [dept, setDept] = useState(loggedInUser?.department);
	const [currentDate, setCurrentDate] = useState(new Date());
	currentDate.setHours(6, 0, 0, 0);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = await UserService.getAllEmpCompanyUsers(company);
				data.map((emp) => {
					emp.fullName = emp?.empId?.fullName;
					emp._id = emp?.empId?._id;
					return emp;
				});
				setEmployeesList(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, []);

	useEffect(() => {
		const fetchAllEmployeeByRole = async () => {
			try {
				const { data } = await UserService.getAllEmployeesByRole(company);

				const newData = Object.keys(data)?.map((role) => {
					return {
						roleName: role,
						color: getRoleColor(role),
						employees: data[role],
					};
				});

				setEmployees(newData);
			} catch (error) {
				console.error(error);
			}
		};
		if (isUserManager) fetchAllEmployeeByRole();
	}, [refresh, company]);

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
						dept={dept}
						setDept={setDept}
						company={company}
						employees={employees}
						setSelectedEmp={setSelectedEmp}
						handleShift={handleShift}
						clearFilter={clearFilter}
						empName={selectedEmp}
					/>
					<Scheduler
						company={company}
						newShiftAdded={newShiftAdded}
						setRefresh={setRefresh}
						locations={locations}
						empName={selectedEmp}
						location={location}
						setLocation={setLocation}
						currentDate={currentDate}
						setCurrentDate={setCurrentDate}
						isUserManager={isUserManager}
						handleItemClick={handleItemClick}
					/>
				</SimpleGrid>
			) : (
				<Scheduler
					company={company}
					setRefresh={setRefresh}
					locations={locations}
					newShiftAdded={newShiftAdded}
					empName={selectedEmp}
					location={location}
					setLocation={setLocation}
					currentDate={currentDate}
					setCurrentDate={setCurrentDate}
					isUserManager={isUserManager}
					handleItemClick={handleItemClick}
				/>
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
