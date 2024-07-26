import { Tbody, Td, Tr } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import TableLayout from "components/ui/table/TableLayout";
import { useState } from "react";
import SettingService from "services/SettingService";
import { dayMonthYear, getDefaultDate } from "utils";

const EditGroup = ({ isOpen, onClose, selectedGroup }) => {
	const schedules = selectedGroup?.scheduleSettings;
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		selectedGroup.scheduleSettings = schedules;
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
		/>
	);
	return (
		<ModalLayout
			title={`Set ${selectedGroup.name} Schedule`}
			size="7xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<TableLayout cols={COLS} height="83vh" isSmall>
				<Tbody>
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
								{edit &&
								record.payPeriod === item.payPeriod &&
								recordKey === "payPeriodEndDate" ? (
									<EditDate
										date={item.payPeriodEndDate}
										index={index}
										_key="payPeriodEndDate"
									/>
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
								{edit &&
								record.payPeriod === item.payPeriod &&
								recordKey === "payPeriodPayDate" ? (
									<EditDate
										date={item.payPeriodPayDate}
										index={index}
										_key="payPeriodPayDate"
									/>
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
