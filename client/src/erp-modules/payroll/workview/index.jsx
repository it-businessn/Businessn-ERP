import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { getPayrollStatus } from "utils";
import PaygroupDetailTable from "./paygroup-detail-table/workview-tabs";
import PaygroupTable from "./paygroup-header-table";

const PayrollWorkview = () => {
	const { company } = useCompany();
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
			/>
			<PaygroupDetailTable />
		</PageLayout>
	);
};

export default PayrollWorkview;
