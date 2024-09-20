import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";

const emp = LocalStorageService.getItem("empId");

const useSelectedEmp = (data) => {
	const [empId, setEmpId] = useState(data || emp);

	useEffect(() => {
		if (empId) {
			LocalStorageService.setItem("empId", empId);
			document.dispatchEvent(
				new CustomEvent("selectedEmpChanged", {
					detail: empId,
				}),
			);
		}
	}, [empId]);

	useEffect(() => {
		const handleSelectedEmpChange = (event) => setEmpId(event.detail);
		document.addEventListener("selectedEmpChanged", handleSelectedEmpChange);

		return () => {
			document.removeEventListener(
				"selectedEmpChanged",
				handleSelectedEmpChange,
			);
		};
	}, []);

	return { empId, setEmpId };
};

export default useSelectedEmp;
