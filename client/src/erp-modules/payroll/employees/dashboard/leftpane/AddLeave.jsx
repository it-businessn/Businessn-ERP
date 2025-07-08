import {
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Stack,
	useToast,
} from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import { getParamKey, LEAVE_TYPES } from "erp-modules/payroll/timesheets/data";
import moment from "moment";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";

const AddLeave = ({ isOpen, handleClose, company, userId, source }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const initialFormData = {
		type: "",
		leaveType: "",
		startDate: null,
		endDate: null,
		company,
		employeeId: userId || "",
		source,
		param_hours: "",
	};
	const [formData, setFormData] = useState(initialFormData);
	const [totalDays, setTotalDays] = useState(0);
	const [totalHours, setTotalHours] = useState(0);
	const toast = useToast();

	useEffect(() => {
		if (formData?.leaveType !== "") {
			setFormData((prevData) => ({
				...prevData,
				param_hours: getParamKey(formData?.leaveType)?.param_hours || "Other",
				type: getParamKey(formData?.leaveType)?.type || formData?.leaveType,
			}));
		}
	}, [formData?.leaveType]);

	useEffect(() => {
		if (formData?.startDate !== "") {
			setFormData((prevData) => ({
				...prevData,
				endDate: formData?.startDate,
			}));
		}
	}, [formData?.startDate]);

	useEffect(() => {
		if (formData?.startDate && formData?.endDate) {
			const { leaveHrs, leaveDays } = calculateLeaveDays(formData?.startDate, formData?.endDate);
			setTotalDays(leaveDays);
			setTotalHours(leaveHrs);
		}
	}, [formData?.endDate]);

	const calculateLeaveDays = (startDate, endDate) => {
		const inDate = moment(startDate).startOf("day");
		const outDate = moment(endDate).startOf("day");
		if (!outDate.isSameOrAfter(inDate)) return { leaveDays: 0, leaveHrs: 0 };

		const inclusiveDays = outDate.diff(inDate, "days") + 1;

		return { leaveDays: inclusiveDays, leaveHrs: inclusiveDays * 8 };
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (!value) return;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await TimesheetService.addLeave(formData);
			toast({
				title: "Time-off request sent!",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<Modal isOpen={isOpen} onClose={handleClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>New Leave Request</ModalHeader> <ModalCloseButton />
				<ModalBody>
					<Stack spacing={3}>
						<FormControl>
							<FormLabel>Start Date</FormLabel>

							<Input
								type="date"
								name="startDate"
								value={formData.startDate}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>End Date</FormLabel>
							<Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
						</FormControl>
						<FormControl>
							<FormLabel>Leave Type</FormLabel>
							<Select
								name="leaveType"
								placeholder="Select leave type"
								value={formData.leaveType}
								onChange={handleChange}
							>
								{LEAVE_TYPES.map((leaveType) => (
									<option key={leaveType} value={leaveType}>
										{leaveType}
									</option>
								))}
							</Select>
						</FormControl>
						<TextTitle
							title={`Total: ${totalDays} day${totalDays > 1 ? "s" : ""} (${totalHours} hours)`}
						></TextTitle>
						{/* <FormControl>
							<FormLabel>Reason</FormLabel>
							<Textarea
								name="reason"
								placeholder="Enter reason for leave"
								value={formData.reason}
								onChange={handleChange}
							/>
						</FormControl> */}
					</Stack>
				</ModalBody>
				<ModalFooter>
					<ActionButtonGroup
						isDisabled={!formData.leaveType || !formData.startDate || !formData.endDate}
						bg="var(--banner_bg)"
						submitBtnName="Submit"
						isLoading={isSubmitting}
						onClose={handleClose}
						onOpen={handleSubmit}
					/>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default AddLeave;
