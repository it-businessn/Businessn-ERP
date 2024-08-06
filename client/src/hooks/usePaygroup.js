import moment from "moment";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { getDefaultDate } from "utils";

const usePaygroup = (company, refresh) => {
	const [payGroups, setPayGroups] = useState(null);
	const [selectedPayGroup, setSelectedPayGroup] = useState(null);
	const [payGroupSchedule, setPayGroupSchedule] = useState(null);
	const [closestRecord, setClosestRecord] = useState(null);

	const today = getDefaultDate(new Date());

	const getClosedSchedule = (schedules) => {
		const closestPayPeriod = schedules?.reduce((closest, record) => {
			const recordEndDate = moment(record.payPeriodEndDate);
			const closestEndDate = moment(closest.payPeriodEndDate);
			return Math.abs(recordEndDate.diff(today)) <
				Math.abs(closestEndDate.diff(today))
				? record
				: closest;
		}, schedules[0]);
		setClosestRecord(closestPayPeriod);
	};

	useEffect(() => {
		const fetchAllPaygroups = async () => {
			try {
				const response = await PayrollService.getAllPaygroups(company);
				setPayGroups(response.data);
				if (response.data.length) {
					setSelectedPayGroup(response.data[0]);
					setPayGroupSchedule(response.data[0]?.scheduleSettings);
					getClosedSchedule(response.data[0]?.scheduleSettings);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllPaygroups();
	}, [company, refresh]);

	return {
		payGroups,
		selectedPayGroup,
		setSelectedPayGroup,
		payGroupSchedule,
		closestRecord,
	};
};

export default usePaygroup;
