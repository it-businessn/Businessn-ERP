import { Avatar, Button, HStack, Icon, SimpleGrid, VStack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import useWorkLocations from "hooks/useWorkLocations";
import PageLayout from "layouts/PageLayout";
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
	const [empRole, setEmpRole] = useState(null);
	const locations = useWorkLocations(company, refresh);

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
											<Button variant="ghost" size="xs" color={"var(--bg_color_1)"}>
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
					/>
				</SimpleGrid>
			) : (
				<Scheduler company={company} setRefresh={setRefresh} locations={locations} />
			)}
			{showAddShiftModal && (
				<ShiftModal
					locations={locations}
					company={company}
					showModal={showAddShiftModal}
					setShowModal={setShowAddShiftModal}
					setIsRefresh={setRefresh}
					setNewShiftAdded={setNewShiftAdded}
					refresh={refresh}
					empName={empName}
					empRole={empRole}
				/>
			)}
		</PageLayout>
	);
};

export default ScheduleWorkView;
