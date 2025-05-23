import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { ROUTE_PATH } from "routes";
import LocalStorageService from "services/LocalStorageService";
import { CURRENT_YEAR } from "utils/convertDate";
import PaygroupDetailTable from "./paygroup-detail-table/workview-tabs";
import PaygroupTable from "./paygroup-header-table";

const PayrollWorkview = () => {
	const empPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}/info`;
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const [refresh, setRefresh] = useState(false);
	const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
	const [yearsList, setYearsList] = useState([CURRENT_YEAR]);
	const loggedInUser = LocalStorageService.getItem("user");
	const { payGroups, selectedPayGroup, payGroupSchedule, closestRecord, closestRecordIndex } =
		usePaygroup(company, refresh, selectedYear);

	useEffect(() => {
		if (selectedPayGroup) {
			setYearsList(selectedPayGroup?.yearSchedules.map(({ year }) => year));
		}
	}, [selectedPayGroup]);

	return (
		<PageLayout
			width={"35%"}
			title={"Workview"}
			showPayGroup={true}
			selectedValue={selectedPayGroup?.name}
			data={payGroups}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
		>
			{payGroupSchedule && (
				<PaygroupTable
					selectedYear={selectedYear}
					setSelectedYear={setSelectedYear}
					empPath={empPath}
					selectedPayGroup={selectedPayGroup}
					yearsList={yearsList}
					payGroupSchedule={payGroupSchedule}
					company={company}
					refresh={refresh}
					setRefresh={setRefresh}
					closestRecord={closestRecord}
					closestRecordIndex={closestRecordIndex}
					loggedInUser={loggedInUser}
				/>
			)}
			<PaygroupDetailTable
				company={company}
				closestRecord={closestRecord}
				empPath={empPath}
				selectedPayGroup={selectedPayGroup}
				groupId={selectedPayGroup?._id}
				loggedInUser={loggedInUser}
			/>
		</PageLayout>
	);
};

export default PayrollWorkview;
