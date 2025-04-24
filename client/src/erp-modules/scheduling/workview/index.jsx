import { Avatar, Button, HStack, Icon, SimpleGrid, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import useRoles from "hooks/useRoles";
import useWorkLocations from "hooks/useWorkLocations";
import PageLayout from "layouts/PageLayout";
import moment from "moment";
import { useEffect, useState } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { getRoleColor, isManager } from "utils";
import HeaderCards from "./HeaderCards";
import Scheduler from "./scheduler";
import ShiftModal from "./ShiftModal";

const ScheduleWorkView = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const isUserManager = isManager(loggedInUser.role);
	const [newShiftAdded, setNewShiftAdded] = useState(null);
	const [employees, setEmployees] = useState(null);
	const [refresh, setRefresh] = useState(null);
	const [showAddShiftModal, setShowAddShiftModal] = useState(false);
	const [empName, setEmpName] = useState(null);
	const [selectedEmp, setSelectedEmp] = useState(null);
	const [empRole, setEmpRole] = useState(null);
	const locations = useWorkLocations(company, refresh);
	const [employeesList, setEmployeesList] = useState(null);
	const roles = useRoles(company, refresh);
	const [location, setLocation] = useState(null);
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
					return { roleName: role, color: getRoleColor(role), employees: data[role] };
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
					<BoxCard fontWeight="bold">
						<TextTitle title="Role" />
						{employees?.map((record) => (
							<VStack spacing={1} key={record.roleName} w={"100%"} alignItems={"self-start"}>
								<TextTitle size="sm" title={record.roleName} />
								{record?.employees?.map(({ empId, name }) => (
									<HStack key={empId} w={"100%"}>
										<HStack
											w={"90%"}
											bgColor={record.color}
											borderRadius={"50px"}
											px={"1"}
											spacing={0}
											cursor={"pointer"}
										>
											<Avatar size={"xs"} name={name} />
											<Button
												onClick={() => setSelectedEmp(name)}
												variant="ghost"
												size="xs"
												color={"var(--bg_color_1)"}
											>
												{name}
											</Button>
										</HStack>
										<Icon
											cursor="pointer"
											as={RxDragHandleDots2}
											onClick={() => handleShift(empId, name, record.color, record.roleName)}
											boxSize={5}
										/>
									</HStack>
								))}
							</VStack>
						))}
					</BoxCard>
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
				/>
			)}
		</PageLayout>
	);
};

export default ScheduleWorkView;
