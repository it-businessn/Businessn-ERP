import { Box, Flex } from "@chakra-ui/react";
import SelectBox from "components/ui/form/select/SelectBox";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import PaygroupTable from "./PaygroupTable";
import PaygroupWorkview from "./PaygroupWorkview";

const PayrollWorkview = () => {
	const [selectedPayGroup, setSelectedPayGroup] = useState(null);
	const [payGroups, setPayGroups] = useState(null);
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);
	useEffect(() => {
		const handleSelectedCompanyChange = (event) => setCompany(event.detail);

		document.addEventListener(
			"selectedCompanyChanged",
			handleSelectedCompanyChange,
		);

		return () => {
			document.removeEventListener(
				"selectedCompanyChanged",
				handleSelectedCompanyChange,
			);
		};
	}, []);
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
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<Flex width={"40%"}>
				<TextTitle title={"Workview"} mb={"0.5em"} width={"10em"} />
				{/* {isManager(role) && employees && ( */}
				<SelectBox
					// handleChange={handleChange}
					// data={payGroups}
					name="name"
					border="1px solid var(--primary_button_bg)"
					color={"brand.primary_button_bg"}
					value={selectedPayGroup}
					placeholder="Select Paygroup"
					size={"sm"}
				/>
				{/* )} */}
			</Flex>
			<PaygroupTable />
			<PaygroupWorkview />
		</Box>
	);
};

export default PayrollWorkview;
