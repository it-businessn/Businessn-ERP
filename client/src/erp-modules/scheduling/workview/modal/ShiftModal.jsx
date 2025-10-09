import {
	Checkbox,
	HStack,
	Spacer,
	Tooltip,
	useDisclosure,
	useToast,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import TextTitle from "components/ui/text/TextTitle";
import usePositionRoles from "hooks/usePositionRoles";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import SchedulerService from "services/SchedulerService";
import AddNewShiftLocation from "./AddNewShiftLocation";
import AddNewShiftRole from "./AddNewShiftRole";

const ShiftModal = ({
	company,
	setShowModal,
	showModal,
	setIsRefresh,
	setNewShiftAdded,
	// locations,
	employees,
	location,
	currentDate,
	shift,
	crew,
	setEmployeeShifts,
}) => {
	const toast = useToast();
	const { onClose } = useDisclosure();
	const [newRoleAdded, setNewRoleAdded] = useState(false);
	const [showAddNewRole, setShowAddNewRole] = useState(false);
	const [showAddNewLocation, setShowAddNewLocation] = useState(false);

	const roles = usePositionRoles(company, newRoleAdded);
	const defaultShiftInfo = {
		employeeName: shift?.empName || "",
		role: shift?.role || "",
		location: shift?.location || location || "",
		notes: shift?.notes || "",
		shiftDate: shift?.shiftDate?.split("T")[0] || currentDate || null,
		shiftStart: shift?.shiftStart || null,
		shiftEnd: shift?.shiftEnd || "12:00",
		shiftDuration: shift?.shiftDuration || null,
		repeatSchedule: shift?.repeatSchedule || false,
		duration: shift?.duration || "1 week",
		companyName: shift?.companyName || company,
		hours: parseInt(shift?.duration) || 0,
		crew,
		payRate: shift?.payRate || 0,
		email: shift?.email || "",
		empId: shift?.empId,
	};
	const [formData, setFormData] = useState(defaultShiftInfo);

	useEffect(() => {
		if (!(formData?.shiftStart && formData?.shiftEnd)) {
			return;
		}
		const start = moment(formData?.shiftStart, "HH:mm");
		const end = moment(formData?.shiftEnd, "HH:mm");
		const duration = moment.duration(end.diff(start));
		const hours = Math.floor(duration.asHours());
		const minutes = duration.minutes();

		setFormData((prev) => ({
			...prev,
			shiftDuration: `${hours || 0}h ${minutes || 0}m`,
			hours,
		}));
	}, [formData?.shiftStart, formData?.shiftEnd]);

	const handleClose = () => {
		onClose();
		setShowModal(false);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async () => {
		const { data } = shift?._id
			? await SchedulerService.updateShift(formData, shift._id)
			: await SchedulerService.addWorkShifts(formData);
		handleClose();
		setNewShiftAdded(data);
	};

	const deleteShift = async () => {
		const { data } = await SchedulerService.deleteShift(formData, shift._id);
		setEmployeeShifts((prev) =>
			prev.map((employee) => {
				if (employee?.name === shift?.empName) {
					return {
						...employee,
						shifts: employee.shifts.map((s) =>
							s?.shiftId === data ? { ...s, shift: "Off", shiftId: null } : s,
						),
					};
				}
				return employee;
			}),
		);

		toast({
			title: "Success",
			description: "Employee shift deleted successfully.",
			status: "success",
			duration: 4000,
			isClosable: true,
		});
		handleClose();
	};

	return (
		<ModalLayout
			title={`${shift?._id ? "Edit" : "Add New"}  Shift`}
			size="lg"
			isOpen={showModal}
			onClose={handleClose}
		>
			<VStack alignItems="flex-start">
				<InputFormControl
					label="Employee Name"
					name="fullName"
					readOnly
					valueText={formData?.employeeName}
				/>
				{/* <FormControlMain>
					<RequiredLabel label="Employee Name" />
					<Select
						name="fullName"
						value={formData?.employeeName}
						onChange={(e) => {
							if (e.target.value) {
								setFormData((prevData) => ({
									...prevData,
									employeeName: e.target.value,
								}));
							}
						}}
						placeholder="Select Employee"
					>
						{employees?.map((_) => (
							<option key={_?._id} value={_.fullName}>
								{_.fullName}
							</option>
						))}
					</Select>
				</FormControlMain> */}
				<HStack w="100%" justify={"space-between"} alignItems={"center"}>
					<SelectFormControl
						required
						valueParam="name"
						name="name"
						label="Role"
						valueText={formData?.role || ""}
						handleChange={(e) => {
							if (e.target.value) {
								setFormData((prevData) => ({
									...prevData,
									role: e.target.value,
								}));
							}
						}}
						options={roles}
						placeholder="Select Role"
					/>
					<Tooltip label="Add new role">
						<span>
							<FaPlus cursor="pointer" onClick={() => setShowAddNewRole(true)} />
						</span>
					</Tooltip>
				</HStack>
				<InputFormControl label="Location" name="notes" readOnly valueText={location} />
				{/* <HStack w="100%" justify={"space-between"}>
					<SelectFormControl
						valueParam="name"
						name="name"
						label="Location"
						valueText={formData?.location || ""}
						handleChange={(e) => {
							if (e.target.value)
								setFormData((prevData) => ({
									...prevData,
									location: e.target.value,
								}));
						}}
						options={locations}
						placeholder="Select Location"
					/>
					<Tooltip label="Add new location">
						<span>
							<FaPlus cursor="pointer" onClick={() => setShowAddNewLocation(true)} />
						</span>
					</Tooltip>
				</HStack> */}
				<InputFormControl
					label="Notes"
					name="notes"
					placeholder="Enter notes/instruction"
					valueText={formData?.notes || ""}
					handleChange={handleChange}
				/>
				<InputFormControl
					label={"Select shift date"}
					name="shiftDate"
					readOnly
					valueText={formData?.shiftDate}
				/>
				{/* <DateTimeFormControl
					label={"Select shift date"}
					valueText1={formData?.shiftDate || ""}
					name1="shiftDate"
					handleChange={handleChange}
					required 
				/> */}
				<HStack w="100%">
					<DateTimeFormControl
						timeLabel="Shift Start Time"
						valueText2={formData?.shiftStart || ""}
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
						valueText2={formData?.shiftEnd || ""}
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
				{formData?.shiftDuration && (
					<TextTitle size="sm" title={`Shift duration: ${formData?.shiftDuration}`} />
				)}
				{!shift?._id && (
					<Checkbox
						colorScheme="facebook"
						name="repeatSchedule"
						isChecked={formData?.repeatSchedule}
						onChange={handleChange}
					>
						Repeat for 1 week
					</Checkbox>
				)}
			</VStack>

			<HStack justifyContent={"space-between"}>
				{shift?._id ? (
					<PrimaryButton
						bg="var(--tas_item_color)"
						size="sm"
						name="Delete Shift"
						onOpen={deleteShift}
						hover="none"
					/>
				) : (
					<Spacer />
				)}
				<PrimaryButton
					size="sm"
					isDisabled={
						!formData?.shiftStart ||
						formData?.shiftStart === "Off" ||
						!formData?.role ||
						formData?.role === "Role"
					}
					name={`${shift?._id ? "Save" : "Add"}`}
					onOpen={handleSubmit}
					hover="none"
				/>
			</HStack>

			{showAddNewRole && (
				<AddNewShiftRole
					showAddNewRole={showAddNewRole}
					setRefresh={setNewRoleAdded}
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
