import { ConfigTabLayout } from "components/ConfigTabLayout";
import useCompanies from "hooks/useCompanies";
import { useEffect, useState } from "react";
import { CompaniesList } from "./CompaniesList";
import { CompanyForm } from "./CompanyForm";

const CompaniesPanel = ({ setOpenCompanyForm }) => {
	const [isRefresh, setIsRefresh] = useState(false);
	const companyList = useCompanies(isRefresh);
	const [editingId, setEditingId] = useState(null);
	const [companies, setCompanies] = useState(null);

	useEffect(() => {
		setCompanies(companyList);
	}, [companyList]);

	const defaultFormData = {
		name: "",
		founding_year: "",
		registration_number: "",
		address: {
			streetNumber: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
		},
		industry_type: "",
		cra_business_number: "",
	};
	const [formData, setFormData] = useState(defaultFormData);

	const handleEdit = (company) => {
		setEditingId(company._id);
		setFormData((prevData) => ({
			...prevData,
			name: company?.name,
			founding_year: company?.founding_year,
			registration_number: company?.registration_number,
			address: company?.address,
			industry_type: company?.industry_type,
			cra_business_number: company?.cra_business_number,
		}));
	};

	const handleClose = () => {
		// setShowConfirmationPopUp(false);
		// setDeleteRecordId(null);
		setEditingId(null);
		setFormData(defaultFormData);
	};

	return (
		<ConfigTabLayout
			tableData={companies}
			tableTitle="All Companies"
			tableContent={<CompaniesList companies={companies} handleEdit={handleEdit} />}
			leftContent={
				<CompanyForm
					editingId={editingId}
					handleClose={handleClose}
					formData={formData}
					setFormData={setFormData}
					setCompanies={setCompanies}
					setOpenCompanyForm={setOpenCompanyForm}
					setIsRefresh={setIsRefresh}
					resetForm={handleClose}
				/>
			}
		/>
	);
};

export default CompaniesPanel;
