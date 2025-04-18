import { Checkbox, HStack, Tooltip, useDisclosure, VStack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { ROLES } from "constant";
import useRoles from "hooks/useRoles";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import SchedulerService from "services/SchedulerService";
import UserService from "services/UserService";
import AddNewShiftLocation from "./AddNewShiftLocation";
import AddNewShiftRole from "./AddNewShiftRole";

const ShiftModal = ({
	company,
	empRole,
	empName,
	setShowModal,
	showModal,
	setIsRefresh,
	refresh,
	setNewShiftAdded,
	locations,
}) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowModal(false);
	};
	const [employees, setEmployees] = useState(null);
	const [showAddNewRole, setShowAddNewRole] = useState(false);
	const [showAddNewLocation, setShowAddNewLocation] = useState(false);
	const roles = useRoles(company, refresh);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = await UserService.getAllCompanyUsers(company, null);
				data.map((emp) => {
					emp.fullName = emp?.empId?.fullName;
					emp._id = emp?.empId?._id;
					return emp;
				});
				setEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, []);

	const defaultShiftInfo = {
		empName: empName || "",
		role: empRole || "",
		location: "",
		notes: "",
		shiftDate: null,
		shiftStart: null,
		shiftEnd: null,
		repeatSchedule: false,
		duration: "1 week",
		companyName: company,
	};

	const [formData, setFormData] = useState(defaultShiftInfo);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async () => {
		const { data } = await SchedulerService.addWorkShifts(formData);
		handleClose();
		setNewShiftAdded(data);
	};

	return (
		<ModalLayout title="Add New Shift" size="lg" isOpen={showModal} onClose={handleClose}>
			<VStack alignItems="flex-start">
				<SelectFormControl
					valueParam="fullName"
					name="fullName"
					label="Employee Name"
					valueText={formData.empName || ""}
					handleChange={(e) =>
						setFormData((prevData) => ({
							...prevData,
							empName: e.target.value,
						}))
					}
					options={employees}
					placeholder="Select Employee"
				/>
				<HStack w="100%" justify={"space-between"}>
					<SelectFormControl
						valueParam="name"
						name="name"
						label="Role"
						valueText={formData.role || ""}
						handleChange={(e) =>
							setFormData((prevData) => ({
								...prevData,
								role: e.target.value,
							}))
						}
						options={roles?.filter(({ name }) => name !== ROLES.SHADOW_ADMIN)}
						placeholder="Select Role"
					/>
					<Tooltip label="Add new role">
						<span>
							<FaPlus cursor="pointer" onClick={() => setShowAddNewRole(true)} />
						</span>
					</Tooltip>
				</HStack>
				<HStack w="100%" justify={"space-between"}>
					<SelectFormControl
						valueParam="name"
						name="name"
						label="Location"
						valueText={formData.location || ""}
						handleChange={(e) =>
							setFormData((prevData) => ({
								...prevData,
								location: e.target.value,
							}))
						}
						options={locations}
						placeholder="Select Location"
					/>
					<Tooltip label="Add new location">
						<span>
							<FaPlus cursor="pointer" onClick={() => setShowAddNewLocation(true)} />
						</span>
					</Tooltip>
				</HStack>
				<InputFormControl
					label="Notes"
					name="notes"
					placeholder="Enter notes/instruction"
					valueText={formData.notes || ""}
					handleChange={handleChange}
				/>
				<DateTimeFormControl
					label={"Select shift date"}
					valueText1={formData.shiftDate || ""}
					name1="shiftDate"
					handleChange={handleChange}
					required
				/>
				<HStack w="100%">
					<DateTimeFormControl
						timeLabel="Shift Start Time"
						valueText2={formData.shiftStart || ""}
						name2="shiftStart"
						handleChange={(e) => {
							setFormData((prevData) => ({
								...prevData,
								shiftStart: e.target.value,
							}));
						}}
						required
					/>
					<DateTimeFormControl
						timeLabel="Shift End Time"
						valueText2={formData.shiftEnd || ""}
						name2="shiftEnd"
						required
						handleChange={(e) => {
							setFormData((prevData) => ({
								...prevData,
								shiftEnd: e.target.value,
							}));
						}}
					/>
				</HStack>
				<Checkbox
					colorScheme="facebook"
					name="repeatSchedule"
					isChecked={formData.repeatSchedule}
					onChange={handleChange}
				>
					Repeat for 1 week
				</Checkbox>
			</VStack>
			<ActionButtonGroup
				submitBtnName="Add"
				onClose={handleClose}
				onOpen={handleSubmit}
				size="sm"
			/>
			{showAddNewRole && (
				<AddNewShiftRole
					showAddNewRole={showAddNewRole}
					setRefresh={setIsRefresh}
					setShowAddNewRole={setShowAddNewRole}
					company={company}
				/>
			)}
			{showAddNewLocation && (
				<AddNewShiftLocation
					showAddNewLocation={showAddNewLocation}
					setRefresh={setIsRefresh}
					setShowAddNewLocation={setShowAddNewLocation}
					company={company}
				/>
			)}
		</ModalLayout>
	);
};

export default ShiftModal;
