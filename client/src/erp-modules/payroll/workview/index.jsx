import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import PaygroupTable from "./PaygroupTable";
import PaygroupWorkview from "./PaygroupWorkview";

const PayrollWorkview = () => {
	const [selectedPayGroup, setSelectedPayGroup] = useState(null);
	const [payGroups, setPayGroups] = useState(null);
	const { company } = useCompany();
	useEffect(() => {
		const fetchAllPaygroups = async () => {
			try {
				const response = await PayrollService.getAllPaygroups(company);
				setPayGroups(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllPaygroups();
	}, [company]);

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
			// handleChange={handleChange}
			// data={payGroups}
			selectedValue={selectedPayGroup}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
		>
			<PaygroupTable />
			<PaygroupWorkview />
		</PageLayout>
	);
};

export default PayrollWorkview;
