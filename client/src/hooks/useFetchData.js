import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import useLoggedInUser from "./useLoggedInUser";

const useFetchData = () => {
	const user = useLoggedInUser();

	const [employees, setEmployees] = useState(null);
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
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllSalesAgents(company);
				setEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, [company]);

	return { user, employees, company };
};

export default useFetchData;
