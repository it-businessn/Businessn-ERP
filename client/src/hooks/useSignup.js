import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import UserService from "services/UserService";

export const useSignup = (refresh) => {
	const company = LocalStorageService.getItem("selectedCompany");
	const defaultFormData = {
		company: company ?? "",
		companyId: "",
		firstName: "",
		middleName: "",
		lastName: "",
		email: "",
		password: "",
		role: "",
		department: "",
		baseModule: "",
		manager: "",
		phoneNumber: "",
		primaryAddress: {
			streetNumber: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
		},
		employmentType: "",
	};

	const [empTypes, setEmpTypes] = useState(null);
	const [roles, setRoles] = useState(null);
	const [modules, setModules] = useState(null);
	const [managers, setManagers] = useState(null);
	const [formData, setFormData] = useState(defaultFormData);

	const resetForm = () => setFormData(defaultFormData);

	useEffect(() => {
		const fetchAllEmpTypes = async () => {
			try {
				const response = await SettingService.getAllEmploymentTypes(formData.company);
				setEmpTypes(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllRoles = async () => {
			try {
				const response = await SettingService.getAllRoles(formData.company);
				setRoles(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllManagers = async () => {
			try {
				const response = await UserService.getAllManagers(formData.company);
				setManagers(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllModules = async () => {
			try {
				const response = await SettingService.getAllModules(formData.company);
				setModules(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (formData.company === "") {
			return;
		}
		fetchAllModules();
		fetchAllManagers();
		fetchAllRoles();
		fetchAllEmpTypes();
	}, [formData.company, refresh]);

	return {
		formData,
		resetForm,
		setFormData,
		empTypes,
		roles,
		modules,
		managers,
	};
};
