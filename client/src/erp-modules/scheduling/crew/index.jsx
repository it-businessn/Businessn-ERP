import LeftIconButton from "components/ui/button/LeftIconButton";
import useCompanyEmployees from "hooks/useCompanyEmployees";
import useCostCenter from "hooks/useCostCenter";
import useDepartment from "hooks/useDepartment";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import AddCrew from "./AddCrew";
import CrewList from "./CrewList";

const Crew = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const [showAdd, setShowAdd] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const { selectedPayGroup } = usePaygroup(company, false);
	const employees = useCompanyEmployees(company, null, selectedPayGroup?.name);
	const costCenters = useCostCenter(company);
	const departments = useDepartment(company);

	return (
		<PageLayout title={"Crews"}>
			<LeftIconButton
				name="Add Crew"
				size="sm"
				icon={<FaPlus color="#fff" fontSize="14px" />}
				handleClick={() => setShowAdd(true)}
				bg="#381c34"
				color="white"
				_hover={{
					bg: "#4e2847",
					transform: "scale(1.02)",
					transition: "all 0.2s ease-in-out",
				}}
				px={4}
			/>
			<CrewList
				company={company}
				refresh={refresh}
				setRefresh={setRefresh}
				employees={employees}
				costCenters={costCenters}
				departments={departments}
			/>
			{showAdd && (
				<AddCrew
					onClose={() => setShowAdd(false)}
					isOpen={showAdd}
					company={company}
					setRefresh={setRefresh}
					employees={employees}
					costCenters={costCenters}
					departments={departments}
				/>
			)}
		</PageLayout>
	);
};

export default Crew;
