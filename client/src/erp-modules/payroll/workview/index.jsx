import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import PaygroupDetailTable from "./PaygroupDetailTable";
import PaygroupTable from "./PaygroupTable";

const PayrollWorkview = () => {
	const [selectedPayGroup, setSelectedPayGroup] = useState(null);
	const { company } = useCompany();
	const payGroups = usePaygroup(company);
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
