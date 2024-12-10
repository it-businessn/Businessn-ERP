import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { sortRecordsByDate } from "utils";

const usePaygroup = (company, refresh) => {
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
			({ payPeriod }) => payPeriod === closestPayPeriod.payPeriod,
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
					setSelectedPayGroup(data[0]);
					const sortedResult = sortRecordsByDate(data[0]?.scheduleSettings, "payPeriodPayDate");
					setPayGroupSchedule(sortedResult);
					getClosestScheduleByProcessingDate(data[0]?.scheduleSettings);
				}
			} catch (error) {
				console.error(error);
			}
		};

		if (refresh !== undefined) {
			fetchAllPaygroups();
		}
	}, [company, refresh]);

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
