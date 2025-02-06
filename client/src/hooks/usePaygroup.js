import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { sortRecordsByDate } from "utils";

const usePaygroup = (company, refresh, year = "2024", isReport = false) => {
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
				const parsedYr = parseInt(year);

				setPayGroups(data);
				if (data.length) {
					setSelectedPayGroup(data[0]);
					const yearIndex = data[0]?.yearSchedules.findIndex(({ year }) => year === parsedYr);
					const sortedResult = sortRecordsByDate(
						data[0]?.yearSchedules[yearIndex]?.payPeriods,
						"payPeriodPayDate",
					);
					setPayGroupSchedule(sortedResult);
					const schedules = data[0]?.yearSchedules[yearIndex]?.payPeriods;
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
						const nextYrSchedules =
							data[0]?.yearSchedules[data[0]?.yearSchedules.findIndex(({ year }) => year === 2025)]
								.payPeriods;
						getClosestScheduleByProcessingDate(nextYrSchedules);
					}
				}
			} catch (error) {
				console.error(error);
			}
		};

		if (refresh !== undefined) {
			fetchAllPaygroups();
		}
	}, [company, refresh, year]);

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
