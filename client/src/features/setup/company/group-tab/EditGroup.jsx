import { Select, Tbody, Td, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import TableLayout from "components/ui/table/TableLayout";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import { CURRENT_YEAR, dayMonthYear, getDefaultDate } from "utils/convertDate";

const EditGroup = ({ isOpen, onClose, selectedGroup }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
	const [schedules, setSchedules] = useState([]);

	const currentScheduleIndex = selectedGroup?.yearSchedules.findIndex(
		({ year }) => year === CURRENT_YEAR,
	);
	const [currentYearScheduleIndex, setCurrentYearScheduleIndex] = useState(currentScheduleIndex);

	useEffect(() => {
		const parsedYear = parseInt(selectedYear);

		setSchedules(selectedGroup?.yearSchedules.find(({ year }) => year === parsedYear)?.payPeriods);
		setCurrentYearScheduleIndex(
			selectedGroup?.yearSchedules?.findIndex(({ year }) => year === parsedYear),
		);
	}, [selectedYear]);

	useEffect(() => {
		if (!selectedGroup?.scheduleSettings?.length) {
			const setUpSchedules = async () => {
				try {
					await SettingService.updateGroup(selectedGroup, selectedGroup._id);
				} catch (error) {
				} finally {
					setIsSubmitting(false);
				}
			};
			setUpSchedules();
		}
	}, [selectedGroup?.scheduleSettings]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (currentYearScheduleIndex < 0) {
			return;
		}
		selectedGroup.yearSchedules[currentYearScheduleIndex].payPeriods = schedules;
		setIsSubmitting(true);
		try {
			await SettingService.updateGroup(selectedGroup, selectedGroup._id);
			onClose();
		} catch (error) {
		} finally {
			setIsSubmitting(false);
		}
	};

	const COLS = [
		"Pay period",
		"Pay period start date",
		"Pay period end date",
		"Payroll Processing date",
		"Pay Date",
	];

	const [edit, setEdit] = useState(false);
	const [record, setRecord] = useState(null);
	const [recordKey, setRecordKey] = useState(null);

	const EditDate = ({ date, index, _key }) => (
		<DateTimeFormControl
			size={"sm"}
			hideLabel
			valueText1={getDefaultDate(date)}
			name1={_key}
			handleChange={(e) => {
				schedules[index][_key] = e.target.value;
				setEdit(false);
			}}
			required
			w="150px"
		/>
	);
	return (
		<ModalLayout
			title={`Set ${selectedGroup.name} Schedule`}
			size="7xl"
			isOpen={isOpen}
			onClose={onClose}
			spacing="0"
		>
			<Select
				w={"10%"}
				size={"sm"}
				border="1px solid var(--primary_button_bg)"
				borderRadius="10px"
				value={selectedYear}
				placeholder="Select Year"
				onChange={(e) => setSelectedYear(e.target.value)}
			>
				{[2024, 2025]?.map((year) => (
					<option value={year} key={year}>
						{year}
					</option>
				))}
			</Select>
			<TableLayout cols={COLS} isSmall>
				<Tbody>
					{(!schedules || schedules?.length === 0) && (
						<EmptyRowRecord data={schedules} colSpan={COLS.length} />
					)}
					{schedules?.map((item, index) => (
						<Tr key={item.payPeriod}>
							<Td p={1}>{item.payPeriod}</Td>
							<Td
								p={1}
								onClick={() => {
									setEdit(true);
									setRecord(item);
									setRecordKey("payPeriodStartDate");
								}}
							>
								{edit &&
								record.payPeriod === item.payPeriod &&
								recordKey === "payPeriodStartDate" ? (
									<EditDate
										date={item.payPeriodStartDate}
										index={index}
										_key="payPeriodStartDate"
									/>
								) : (
									dayMonthYear(item.payPeriodStartDate)
								)}
							</Td>
							<Td
								p={1}
								onClick={() => {
									setEdit(true);
									setRecord(item);
									setRecordKey("payPeriodEndDate");
								}}
							>
								{edit && record.payPeriod === item.payPeriod && recordKey === "payPeriodEndDate" ? (
									<EditDate date={item.payPeriodEndDate} index={index} _key="payPeriodEndDate" />
								) : (
									dayMonthYear(item.payPeriodEndDate)
								)}
							</Td>
							<Td
								p={1}
								onClick={() => {
									setEdit(true);
									setRecord(item);
									setRecordKey("payPeriodProcessingDate");
								}}
							>
								{edit &&
								record.payPeriod === item.payPeriod &&
								recordKey === "payPeriodProcessingDate" ? (
									<EditDate
										date={item.payPeriodProcessingDate}
										index={index}
										_key="payPeriodProcessingDate"
									/>
								) : (
									dayMonthYear(item.payPeriodProcessingDate)
								)}
							</Td>
							<Td
								onClick={() => {
									setEdit(true);
									setRecord(item);
									setRecordKey("payPeriodPayDate");
								}}
								p={1}
							>
								{edit && record.payPeriod === item.payPeriod && recordKey === "payPeriodPayDate" ? (
									<EditDate date={item.payPeriodPayDate} index={index} _key="payPeriodPayDate" />
								) : (
									dayMonthYear(item.payPeriodPayDate)
								)}
							</Td>
						</Tr>
					))}
				</Tbody>
			</TableLayout>
			<ActionButtonGroup
				submitBtnName={"Save"}
				isLoading={isSubmitting}
				onClose={onClose}
				onOpen={handleSubmit}
			/>
		</ModalLayout>
	);
};

export default EditGroup;
