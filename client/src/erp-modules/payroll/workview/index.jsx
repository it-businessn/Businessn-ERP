import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import moment from "moment";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { getDefaultDate, getPayrollStatus } from "utils";
import PaygroupDetailTable from "./paygroup-detail-table/workview-tabs";
import PaygroupTable from "./paygroup-header-table";

const PayrollWorkview = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const [refresh, setRefresh] = useState(false);

	const { payGroups, selectedPayGroup, setSelectedPayGroup, payGroupSchedule } =
		usePaygroup(company, refresh);

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroup(value);
		}
	};

	payGroupSchedule?.map((record) => {
		const { color, bg, name, isDisabledStatus, isViewAction } =
			getPayrollStatus(record);
		record.color = color;
		record.bg = bg;
		record.name = name;
		record.isDisabledStatus = isDisabledStatus;
		record.isViewAction = isViewAction;
		return record;
	});
	const today = getDefaultDate(new Date());

	const closestRecord = payGroupSchedule?.reduce((closest, record) => {
		const recordEndDate = moment(record.payPeriodEndDate);
		const closestEndDate = moment(closest.payPeriodEndDate);
		return Math.abs(recordEndDate.diff(today)) <
			Math.abs(closestEndDate.diff(today))
			? record
			: closest;
	}, payGroupSchedule[0]);
	return (
		<PageLayout
			width={"35%"}
			title={"Workview"}
			showSelectBox={true}
			handleChange={handleChange}
			data={payGroups}
			selectedValue={selectedPayGroup?.name}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
		>
			<PaygroupTable
				selectedPayGroup={selectedPayGroup}
				payGroupSchedule={payGroupSchedule}
				company={company}
				refresh={refresh}
				setRefresh={setRefresh}
				closestRecord={closestRecord}
			/>
			<PaygroupDetailTable closestRecord={closestRecord} />
		</PageLayout>
	);
};

export default PayrollWorkview;
