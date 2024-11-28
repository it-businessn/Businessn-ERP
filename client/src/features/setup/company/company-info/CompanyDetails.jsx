import { HStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";

import LeftIconButton from "components/ui/button/LeftIconButton";
import { useEffect, useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import { isManager } from "utils";
import CompaniesPanel from "../CompaniesPanel";
import CompanyInfo from "./CompanyInfo";
import EditCompanyInfo from "./EditCompanyInfo";

const CompanyDetails = ({ company, modules }) => {
	const loggedInUser = LocalStorageService.getItem("user");
	const [openCompanyForm, setOpenCompanyForm] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [companyInfo, setCompanyInfo] = useState(null);

	useEffect(() => {
		const fetchCompanyInfo = async () => {
			try {
				const response = await SettingService.getCompanyInfo(company);
				setCompanyInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchCompanyInfo();
	}, [company]);

	return (
		<>
			{isManager(loggedInUser?.role) && (
				<HStack justify={"end"}>
					<LeftIconButton
						color={"var(--nav_color)"}
						border={"2px solid var(--filter_border_color)"}
						name={"Update"}
						borderRadius={"10px"}
						variant={"ghost"}
						isFilter
						size="md"
						handleClick={() => setShowEditDialog(true)}
						icon={<MdSettingsSuggest />}
					/>
					<PrimaryButton name={"Add new company"} onOpen={() => setOpenCompanyForm(true)} />
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
