import { useState } from "react";
import CompaniesPanel from "../../../configuration/company";
import CompanyInfo from "./CompanyInfo";

const CompanyDetails = ({ company, modules }) => {
	const [openCompanyForm, setOpenCompanyForm] = useState(false);

	return (
		<>
			{openCompanyForm && <CompaniesPanel setOpenCompanyForm={setOpenCompanyForm} />}

			{!openCompanyForm && <CompanyInfo modules={modules} company={company} />}
		</>
	);
};

export default CompanyDetails;
