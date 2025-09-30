import { HStack } from "@chakra-ui/react";

import LeftIconButton from "components/ui/button/LeftIconButton";
import useSelectedCompanyInfo from "hooks/useSelectedCompanyInfo";
import { useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import CompaniesPanel from "../../../configuration/company";
import CompanyInfo from "./CompanyInfo";
import EditCompanyInfo from "./EditCompanyInfo";

const CompanyDetails = ({ company, modules }) => {
	const loggedInUser = LocalStorageService.getItem("user");
	const [openCompanyForm, setOpenCompanyForm] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const companyInfo = useSelectedCompanyInfo(company);

	return (
		<>
			{isManager(loggedInUser?.role) && (
				<HStack justify={"end"}>
					<LeftIconButton
						color="var(--nav_color)"
						border="2px solid var(--filter_border_color)"
						name="Update CRA Number"
						borderRadius="10px"
						variant="ghost"
						isFilter
						size="md"
						handleClick={() => setShowEditDialog(true)}
						icon={<MdSettingsSuggest />}
					/>
					{/* <PrimaryButton name="View / Add Company" onOpen={() => setOpenCompanyForm(true)} /> */}
				</HStack>
			)}
			{openCompanyForm && <CompaniesPanel setOpenCompanyForm={setOpenCompanyForm} />}
			{showEditDialog && (
				<EditCompanyInfo
					isOpen={showEditDialog}
					companyInfo={companyInfo}
					onClose={() => setShowEditDialog(false)}
				/>
			)}

			{!openCompanyForm && companyInfo && (
				<CompanyInfo modules={modules} companyInfo={companyInfo} />
			)}
		</>
	);
};

export default CompanyDetails;
