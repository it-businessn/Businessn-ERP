import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { sortRecordsByDate } from "utils";
import { CURRENT_YEAR } from "utils/convertDate";

const usePaygroup = (
	company,
	selectedPayGroupOption,
	refresh,
	year = CURRENT_YEAR,
	isReport = false,
) => {
	const [payGroups, setPayGroups] = useState(null);
	const [selectedPayGroup, setSelectedPayGroup] = useState(null);
	const [payGroupSchedule, setPayGroupSchedule] = useState(null);
	const [closestRecord, setClosestRecord] = useState(null);
	const [closestRecordIndex, setClosestRecordIndex] = useState(0);

	const getClosestScheduleByProcessingDate = (schedules) => {
		// const closestPayPeriod = schedules
		// 	?.filter(({ isProcessed }) => !isProcessed)
		// 	?.reduce((closest, record) => {
		// 		const recordEndDate = getMomentDate(record.payPeriodProcessingDate);
		// 		const closestEndDate = getMomentDate(closest.payPeriodProcessingDate);
		// 		return Math.abs(recordEndDate.diff(today)) <
		// 			Math.abs(closestEndDate.diff(today))
		// 			? record
		// 			: closest;
		// 	}, schedules[0]);

		// const closestPayPeriod = schedules[22];
		const closestPayPeriod = schedules?.find(({ isProcessed }) => !isProcessed);

		const closestPayPeriodIndex = schedules.findIndex(
			({ payPeriod }) => payPeriod === closestPayPeriod?.payPeriod,
		);
		setClosestRecord(closestPayPeriod);
		setClosestRecordIndex(closestPayPeriodIndex);
	};

	useEffect(() => {
		const fetchAllPaygroups = async () => {
			try {
				const { data } = await PayrollService.getAllPaygroups(company);
				setPayGroups(data);
				if (data.length) {
					const payGroup = selectedPayGroupOption
						? data.find(
								({ scheduleFrequency, name }) =>
									scheduleFrequency === selectedPayGroupOption || name === selectedPayGroupOption,
						  )
						: data[0];
					setSelectedPayGroup(payGroup);
				}
			} catch (error) {
				console.error(error);
			}
		};

		if (refresh !== undefined) {
			fetchAllPaygroups();
		}
	}, [company, refresh, selectedPayGroupOption]);

	useEffect(() => {
		if (selectedPayGroup) {
			const parsedYr = parseInt(year);
			const yearIndex = selectedPayGroup?.yearSchedules.findIndex(({ year }) => year === parsedYr);
			const sortedResult = sortRecordsByDate(
				selectedPayGroup?.yearSchedules[yearIndex]?.payPeriods,
				"payPeriodPayDate",
				true,
				true,
				selectedPayGroup.scheduleFrequency,
			);
			setPayGroupSchedule(sortedResult);
			const schedules = selectedPayGroup?.yearSchedules[yearIndex]?.payPeriods;
			const closestPayPeriod = schedules?.find(({ isProcessed }) => !isProcessed);

			if (isReport) {
				const lastIndex = schedules.length - 1;
				const closestPayPeriodIndex = closestPayPeriod
					? schedules.findIndex(({ payPeriod }) => payPeriod === closestPayPeriod?.payPeriod)
					: lastIndex;

				setClosestRecord(closestPayPeriod || schedules[lastIndex]);
				setClosestRecordIndex(closestPayPeriodIndex);
			}

			if (closestPayPeriod) {
				getClosestScheduleByProcessingDate(schedules, isReport);
			} else {
				const closestYrSchedules =
					selectedPayGroup?.yearSchedules[
						selectedPayGroup?.yearSchedules.findIndex(({ year }) => year === 2025)
					]?.payPeriods;

				getClosestScheduleByProcessingDate(closestYrSchedules);
			}
		}
	}, [selectedPayGroup, year]);
	return {
		payGroups,
		selectedPayGroup,
		setSelectedPayGroup,
		payGroupSchedule,
		closestRecord,
		closestRecordIndex,
	};
};

export default usePaygroup;
