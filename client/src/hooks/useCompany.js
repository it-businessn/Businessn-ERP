import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";

const comp = LocalStorageService.getItem("selectedCompany");

const useCompany = (defaultCompany) => {
	const [company, setSelectedCompany] = useState(defaultCompany || comp);

	useEffect(() => {
		if (company) {
			LocalStorageService.setItem("selectedCompany", company);
			// styleConsole(company);
			document.dispatchEvent(
				new CustomEvent("selectedCompanyChanged", {
					detail: company,
				}),
			);
		}
	}, [company]);

	useEffect(() => {
		const handleSelectedCompanyChange = (event) =>
			setSelectedCompany(event.detail);
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

	return { company, setSelectedCompany };
};

export default useCompany;
