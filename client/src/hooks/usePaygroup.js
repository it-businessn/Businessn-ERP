import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { sortRecordsByDate } from "utils";
import { isBusinessN } from "utils/common";
import { CURRENT_YEAR } from "utils/convertDate";

const usePaygroup = (company, refresh, year = CURRENT_YEAR, isReport = false) => {
	const [payGroups, setPayGroups] = useState(null);
	const [selectedPayGroup, setSelectedPayGroup] = useState(null);
	const [allPayGroupSchedule, setAllPayGroupSchedule] = useState(null);
	const [payGroupSchedule, setPayGroupSchedule] = useState(null);
	const [closestRecord, setClosestRecord] = useState(null);
	const [closestRecordIndex, setClosestRecordIndex] = useState(0);
	const [hasMultiPaygroups, setHasMultiPaygroups] = useState(false);
	const [selectedPayGroupOption, setSelectedPayGroupOption] = useState(null);

	useEffect(() => {
		const fetchAllPaygroups = async () => {
			try {
				const { data } = await PayrollService.getAllPaygroups(company);
				setPayGroups(data);
				if (data.length) {
					setHasMultiPaygroups(data?.length > 1);
					const payGroup = isBusinessN(company)
						? data.find(({ scheduleFrequency }) => scheduleFrequency === "Monthly")
						: data[0];
					setSelectedPayGroup(payGroup);
				}
			} catch (error) {
				console.error(error);
			}
		};

		if (refresh || refresh === false) {
			fetchAllPaygroups();
		}
	}, [company, refresh]);

	useEffect(() => {
		if (selectedPayGroupOption) {
			const payGroup = payGroups?.find(({ name }) => name === selectedPayGroupOption);
			setSelectedPayGroup(payGroup);
		}
	}, [selectedPayGroupOption]);

	useEffect(() => {
		if (selectedPayGroup) {
			setSelectedPayGroupOption(selectedPayGroup?.name);
			const parsedYr = parseInt(year);
			const yearIndex = selectedPayGroup?.yearSchedules?.findIndex(({ year }) => year === parsedYr);
			const sortedResult = sortRecordsByDate(
				selectedPayGroup?.yearSchedules[yearIndex]?.payPeriods,
				"payPeriodPayDate",
				true,
				true,
				selectedPayGroup.scheduleFrequency,
			);
			setAllPayGroupSchedule(sortedResult);
			const schedules = selectedPayGroup?.yearSchedules[yearIndex]?.payPeriods;
			const closestPayPeriod = schedules?.find(({ isProcessed }) => !isProcessed);

			if (isReport) {
				const lastIndex = schedules.length - 1;
				const closestPayPeriodIndex = closestPayPeriod
					? schedules?.findIndex(({ payPeriod }) => payPeriod === closestPayPeriod?.payPeriod)
					: lastIndex;

				setClosestRecord(closestPayPeriod || schedules[lastIndex]);
				setClosestRecordIndex(closestPayPeriodIndex);
			}
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

				const closestPayPeriodIndex = schedules?.findIndex(
					({ payPeriod, isExtraRun }) =>
						payPeriod === closestPayPeriod?.payPeriod && isExtraRun === true,
				);
				const fallbackIndex =
					closestPayPeriodIndex === -1
						? schedules?.findIndex(({ payPeriod }) => payPeriod === closestPayPeriod?.payPeriod)
						: closestPayPeriodIndex;

				setClosestRecord(closestPayPeriod);
				setClosestRecordIndex(fallbackIndex);
			};

			if (closestPayPeriod) {
				getClosestScheduleByProcessingDate(schedules, isReport);
			} else {
				const closestYrSchedules =
					selectedPayGroup?.yearSchedules[
						selectedPayGroup?.yearSchedules?.findIndex(({ year }) => year === 2025)
					]?.payPeriods;

				getClosestScheduleByProcessingDate(closestYrSchedules);
			}
		}
	}, [selectedPayGroup, year]);

	useEffect(() => {
		if (allPayGroupSchedule && closestRecordIndex >= 0 && selectedPayGroup) {
			if (!allPayGroupSchedule[closestRecordIndex]?.isDisabledAction) {
				allPayGroupSchedule.map((_, index) => {
					if (index > closestRecordIndex) {
						_.isDisabledAction = true;
						return _;
					}
				});
			}
			setPayGroupSchedule(allPayGroupSchedule);
		}
	}, [selectedPayGroup, closestRecordIndex, allPayGroupSchedule]);

	return {
		payGroups,
		selectedPayGroup,
		setSelectedPayGroup,
		payGroupSchedule,
		closestRecord,
		closestRecordIndex,
		hasMultiPaygroups,
		selectedPayGroupOption,
		setSelectedPayGroupOption,
	};
};

export default usePaygroup;
