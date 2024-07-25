import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import UserService from "services/UserService";

export const useSignup = (optionDataRefresh) => {
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
	const [companies, setCompanies] = useState(null);
	const [empTypes, setEmpTypes] = useState(false);
	const [roles, setRoles] = useState(false);
	const [departments, setDepartments] = useState(false);
	const [modules, setModules] = useState(false);
	const [managers, setManagers] = useState(false);
	const [formData, setFormData] = useState(defaultFormData);

	const resetForm = () => setFormData(defaultFormData);
	useEffect(() => {
		const fetchAllCompanies = async () => {
			try {
				const response = await SettingService.getAllCompanies();
				setCompanies(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllCompanies();
	}, []);

	useEffect(() => {
		const fetchAllEmpTypes = async () => {
			try {
				const response = await SettingService.getAllEmploymentTypes(
					formData.company,
				);
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
		const fetchAllDepartments = async () => {
			try {
				const response = await SettingService.getAllDepartments(
					formData.company,
				);
				setDepartments(response.data);
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
		fetchAllDepartments();
		fetchAllEmpTypes();
	}, [formData.company, optionDataRefresh]);

	return {
		formData,
		resetForm,
		setFormData,
		companies,
		empTypes,
		roles,
		departments,
		modules,
		managers,
	};
};
