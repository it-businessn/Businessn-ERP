import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import LocalStorageService from "services/LocalStorageService";
import WorkviewTable from "../workview/paygroup-header-table/WorkviewTable";

const Reports = () => {
	const company = LocalStorageService.getItem("selectedCompany");

	const { payGroupSchedule, closestRecordIndex } = usePaygroup(company, false);
	const filteredPayPeriods = payGroupSchedule?.filter(
		(_, index) => index < closestRecordIndex,
	);
	return (
		<PageLayout title={"Reports"}>
			{filteredPayPeriods && (
				<WorkviewTable
					payGroupSchedule={filteredPayPeriods}
					closestRecordIndex={closestRecordIndex}
					height="82vh"
				/>
			)}
		</PageLayout>
	);
};

export default Reports;
