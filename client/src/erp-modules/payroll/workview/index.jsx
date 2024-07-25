import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import PaygroupDetailTable from "./PaygroupDetailTable";
import PaygroupTable from "./PaygroupTable";

const PayrollWorkview = () => {
	const { company } = useCompany();
	const { payGroups, selectedPayGroup, setSelectedPayGroup } =
		usePaygroup(company);

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroup(value);
		}
	};
	console.log(payGroups, selectedPayGroup);

	return (
		<PageLayout
			width={"35%"}
			title={"Workview"}
			showSelectBox={true}
			handleChange={handleChange}
			data={payGroups}
			selectedValue={selectedPayGroup}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
		>
			<PaygroupTable />
			<PaygroupDetailTable />
		</PageLayout>
	);
};

export default PayrollWorkview;
