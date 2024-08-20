import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { ROUTE_PATH } from "routes";
import LocalStorageService from "services/LocalStorageService";
import PaygroupDetailTable from "./paygroup-detail-table/workview-tabs";
import PaygroupTable from "./paygroup-header-table";

const PayrollWorkview = () => {
	const empPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}`;
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const [refresh, setRefresh] = useState(false);

	const {
		payGroups,
		selectedPayGroup,
		setSelectedPayGroup,
		payGroupSchedule,
		closestRecord,
		closestRecordIndex,
	} = usePaygroup(company, refresh);

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroup(value);
		}
	};

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
			{payGroupSchedule && (
				<PaygroupTable
					empPath={empPath}
					selectedPayGroup={selectedPayGroup}
					payGroupSchedule={payGroupSchedule}
					company={company}
					refresh={refresh}
					setRefresh={setRefresh}
					closestRecord={closestRecord}
					closestRecordIndex={closestRecordIndex}
				/>
			)}
			<PaygroupDetailTable
				company={company}
				closestRecord={closestRecord}
				empPath={empPath}
				selectedPayGroup={selectedPayGroup}
				groupId={selectedPayGroup?._id}
			/>
		</PageLayout>
	);
};

export default PayrollWorkview;
