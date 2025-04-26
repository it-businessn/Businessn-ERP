import { Checkbox, HStack, Select, Tooltip, useDisclosure, VStack } from "@chakra-ui/react";
import FormControlMain from "components/ui/form";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import RequiredLabel from "components/ui/form/RequiredLabel";
import SelectFormControl from "components/ui/form/SelectFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import TextTitle from "components/ui/text/TextTitle";
import { ROLES } from "constant";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import SchedulerService from "services/SchedulerService";
import AddNewShiftLocation from "./AddNewShiftLocation";
import AddNewShiftRole from "./AddNewShiftRole";

const ShiftModal = ({
	company,
	empRole,
	empName,
	setShowModal,
	showModal,
	setIsRefresh,
	setNewShiftAdded,
	locations,
	employees,
	roles,
	location,
	currentDate,
	shift,
}) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowModal(false);
	};
	const [showAddNewRole, setShowAddNewRole] = useState(false);
	const [showAddNewLocation, setShowAddNewLocation] = useState(false);

	const defaultShiftInfo = {
		employeeName: shift?.empName || empName || "",
		role: shift?.role || empRole || "",
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
	};

	const [formData, setFormData] = useState(defaultShiftInfo);

	useEffect(() => {
		if (!(formData.shiftStart && formData?.shiftEnd)) {
			return;
		}
		const start = moment(formData.shiftStart, "HH:mm");
		const end = moment(formData.shiftEnd, "HH:mm");
		const duration = moment.duration(end.diff(start));
		const hours = Math.floor(duration.asHours());
		const minutes = duration.minutes();

		setFormData((prev) => ({
			...prev,
			shiftDuration: `${hours}h ${minutes}m`,
			hours,
		}));
	}, [formData?.shiftStart, formData?.shiftEnd]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async () => {
		const { data } = shift
			? await SchedulerService.updateShift(formData, shift._id)
			: await SchedulerService.addWorkShifts(formData);
		handleClose();
		setNewShiftAdded(data);
	};

	return (
		<ModalLayout title="Add New Shift" size="lg" isOpen={showModal} onClose={handleClose}>
			<VStack alignItems="flex-start">
				<FormControlMain>
					<RequiredLabel label="Employee Name" />
					<Select
						name="fullName"
						value={formData.employeeName}
						onChange={(e) =>
							setFormData((prevData) => ({
								...prevData,
								employeeName: e.target.value,
							}))
						}
						placeholder="Select Employee"
					>
						{employees?.map((_) => (
							<option key={_?._id} value={_.fullName}>
								{_.fullName}
							</option>
						))}
					</Select>
				</FormControlMain>
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
				{formData.shiftDuration && (
					<TextTitle size="sm" title={`Shift duration: ${formData.shiftDuration}`} />
				)}
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
