import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import PaygroupDetailTable from "./PaygroupDetailTable";
import PaygroupTable from "./PaygroupTable";

const PayrollWorkview = () => {
	const { company } = useCompany();
	const { payGroups, selectedPayGroup, setSelectedPayGroup, payGroupSchedule } =
		usePaygroup(company);

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
			<PaygroupTable selectedPayGroup={selectedPayGroup} />
			<PaygroupDetailTable />
		</PageLayout>
	);
};

export default PayrollWorkview;
