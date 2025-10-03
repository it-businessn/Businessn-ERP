import { HStack, Select, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import NewEmployeeOnboardingModal from "erp-modules/payroll/onboard-user/NewEmployeeOnboardingModal";
import { useEffect, useState } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaMoneyCheckAlt, FaWpforms } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { RiUserAddLine, RiUserUnfollowLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { payrollEmployeePath, payrollROEPath } from "routes";
import { isManager } from "utils";
import ExtraPayrunModal from "./ExtraPayrunModal";
import PayrollActions from "./PayrollActions";
import WorkviewTable from "./WorkviewTable";

const PAYGROUP_ACTIONS = [
	{ key: "roe", name: "Issue Roes", icon: FaWpforms },
	{ key: "form", name: "Issue Forms", icon: AiOutlineFileDone },
	{ key: "extra", name: "Extra Pay Run", icon: FaMoneyCheckAlt },
	{ key: "terminate", name: "Terminate", icon: RiUserUnfollowLine },
	{ key: "empUpdate", name: "Update Employees", icon: MdUpdate },
	{ key: "onboard", name: "Onboard Employee", icon: RiUserAddLine },
];

const PaygroupTable = ({
	selectedPayGroup,
	company,
	payGroupSchedule,
	setRefresh,
	closestRecord,
	closestRecordIndex,
	empPath,
	selectedYear,
	setSelectedYear,
	yearsList,
	loggedInUser,
	selectedPayGroupOption,
}) => {
	const [showExtraPayrun, setShowExtraPayrun] = useState(false);
	const [showOnboard, setShowOnboard] = useState(false);
	const [payrollActions, setPayrollActions] = useState(PAYGROUP_ACTIONS);

	useEffect(() => {
		if (isManager(loggedInUser?.role)) {
			setPayrollActions(payrollActions.filter(({ key }) => key !== "roe"));
		}
	}, [loggedInUser]);

	const navigate = useNavigate();

	const handleClick = (val) => {
		if (val === "extra") {
			setShowExtraPayrun(true);
		}
		if (val === "empUpdate") {
			navigate(payrollEmployeePath);
		}
		if (val === "onboard") {
			setShowOnboard(true);
		}
		if (val === "terminate") {
			navigate(payrollEmployeePath);
			// navigate(`${empPath}/${loggedInUser._id}/3`);
		}
		if (val === "roe") {
			navigate(payrollROEPath);
		}
	};

	return (
		<SimpleGrid
			columns={{ base: 1, md: 1, lg: 2 }}
			spacing="4"
			my="4"
			mr="4"
			templateColumns={{ lg: "70% 30%" }}
		>
			<BoxCard>
				<VStack spacing={1} w={"100%"} alignItems={"end"}>
					<HStack justifyContent="end" alignItems="center">
						<Select
							size={"sm"}
							border="1px solid var(--primary_button_bg)"
							borderRadius="10px"
							value={selectedYear}
							placeholder="Select Year"
							onChange={(e) => {
								if (e.target.value) {
									setSelectedYear(e.target.value);
								}
							}}
						>
							{yearsList?.map((year) => (
								<option value={year} key={year}>
									{year}
								</option>
							))}
						</Select>

						<PrimaryButton
							name={"Add extra payrun"}
							size="xs"
							px={"3em"}
							onOpen={() => setShowExtraPayrun(true)}
						/>
					</HStack>
					{showExtraPayrun && (
						<ExtraPayrunModal
							company={company}
							showExtraPayrun={showExtraPayrun}
							setRefresh={setRefresh}
							setShowExtraPayrun={setShowExtraPayrun}
							selectedPayGroup={selectedPayGroup}
							closestRecord={closestRecord}
							selectedPayGroupOption={selectedPayGroupOption}
						/>
					)}
					{showOnboard && (
						<NewEmployeeOnboardingModal
							isOpen={showOnboard}
							onClose={() => setShowOnboard(false)}
						/>
					)}
					<WorkviewTable
						payGroupSchedule={payGroupSchedule}
						closestRecordIndex={closestRecordIndex}
						autoScroll
						selectedYear={selectedYear}
						css={tabScrollCss}
					/>
				</VStack>
			</BoxCard>
			<PayrollActions actions={payrollActions} handleClick={handleClick} />
		</SimpleGrid>
	);
};

export default PaygroupTable;
