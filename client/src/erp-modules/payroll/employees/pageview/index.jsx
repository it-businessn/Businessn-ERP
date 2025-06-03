import {
	Avatar,
	HStack,
	Spacer,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	VStack,
} from "@chakra-ui/react";
import ActiveBadge from "components/ActiveBadge";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { ROLES } from "constant";
import BankingInfo from "erp-modules/payroll/onboard-user/BankingInfo";
import BenefitInfo from "erp-modules/payroll/onboard-user/BenefitInfo";
import {
	COUNTRIES,
	tabStyleCss,
	userInfoDetails,
} from "erp-modules/payroll/onboard-user/customInfo";
import EmploymentInfo from "erp-modules/payroll/onboard-user/EmploymentInfo";
import GovernmentInfo from "erp-modules/payroll/onboard-user/GovernmentInfo";
import PayInfo from "erp-modules/payroll/onboard-user/PayInfo";
import PersonalInfo from "erp-modules/payroll/onboard-user/PersonalInfo";
import useCompany from "hooks/useCompany";
import useCompanyEmployees from "hooks/useCompanyEmployees";
import usePaygroup from "hooks/usePaygroup";
import useSelectedEmp from "hooks/useSelectedEmp";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import EmpProfileSearch from "../EmpProfileSearch";

const Employees = () => {
	const { id, stepNo } = useParams();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const deptName = loggedInUser?.role === ROLES.MANAGER ? loggedInUser?.department : null;
	const [employee, setEmployee] = useState(null);
	const [userId, setUserId] = useState(id ? id : loggedInUser._id);
	const { setEmpId } = useSelectedEmp(userId);
	const { selectedPayGroupOption } = usePaygroup(company, false);
	const employees = useCompanyEmployees(company, deptName, selectedPayGroupOption);
	const [filteredEmployees, setFilteredEmployees] = useState(null);
	const [tabIndex, setTabIndex] = useState(parseInt(stepNo) || 0);

	useEffect(() => {
		setFilteredEmployees(employees);
	}, [employees]);

	useEffect(() => {
		if (id && employees) {
			const user = employees?.find(({ empId }) => empId?._id === id);
			setEmployee(user);
		}
	}, [id, employees]);

	useEffect(() => {
		setEmpId(userId);
	}, [userId]);

	const isActivePayroll =
		employee?.payrollStatus?.includes("Active") ||
		(!id && !employee && loggedInUser?.payrollStatus?.includes("Active"));

	const employeeID = employee?.employeeNo || (!id && !employee && loggedInUser?.employeeId);
	const employeeName = employee?.empId?.fullName || (!id && !employee && loggedInUser?.fullName);

	const [personalSubStep, setPersonalSubStep] = useState(0);
	const [employmentSubStep, setEmploymentSubStep] = useState(0);
	const [benefitsSubStep, setBenefitsSubStep] = useState(0);
	const [governmentSubStep, setGovernmentSubStep] = useState(0);
	const [bankingSubStep, setBankingSubStep] = useState(0);
	const [formData, setFormData] = useState(userInfoDetails);
	const [availableProvinces, setAvailableProvinces] = useState([]);
	const [employmentProvinces, setEmploymentProvinces] = useState([]);
	const [governmentProvinces, setGovernmentProvinces] = useState([]);
	const [dataRefresh, setDataRefresh] = useState(false);

	useEffect(() => {
		const selectedCountry = COUNTRIES.find(
			(country) => country.type === formData.contactInfo.country,
		);
		if (selectedCountry) {
			setAvailableProvinces(selectedCountry?.provinces);
			if (!selectedCountry.provinces.includes(formData.contactInfo.province)) {
				setFormData({
					...formData,
					contactInfo: {
						...formData.contactInfo,
						province: selectedCountry.provinces[0],
					},
				});
			}
		}
	}, [formData.contactInfo.country]);

	useEffect(() => {
		const selectedCountry = COUNTRIES.find(
			(country) => country.type === formData.employmentInfo.employmentCountry,
		);
		if (selectedCountry) {
			setEmploymentProvinces(selectedCountry.provinces);
			if (!selectedCountry.provinces.includes(formData.employmentInfo.employmentRegion)) {
				setFormData({
					...formData,
					employmentInfo: {
						...formData.employmentInfo,
						province: selectedCountry.provinces[0],
					},
				});
			}
		}
	}, [formData.employmentInfo.employmentCountry]);

	useEffect(() => {
		const selectedCountry = COUNTRIES.find(
			(country) => country.type === formData.governmentInfo.federalTax,
		);
		if (selectedCountry) {
			setGovernmentProvinces(selectedCountry.provinces);
			if (!selectedCountry.provinces.includes(formData.governmentInfo.regionalTax)) {
				setFormData({
					...formData,
					governmentInfo: {
						...formData.governmentInfo,
						regionalTax: selectedCountry.provinces[0],
					},
				});
			}
		}
	}, [formData.governmentInfo.federalTax]);

	const handleChange = (section, field, value) => {
		setFormData({
			...formData,
			[section]: {
				...formData[section],
				[field]: value,
			},
		});
	};

	const EMP_INFO_TABS = [
		{
			id: 0,
			name: "Personal Info",
			content: (
				<PersonalInfo
					personalSubStep={personalSubStep}
					setPersonalSubStep={setPersonalSubStep}
					formData={formData}
					handleChange={handleChange}
					availableProvinces={availableProvinces}
					isEditMode
				/>
			),
		},
		{
			id: 1,
			name: "Employment",
			content: (
				<EmploymentInfo
					employmentSubStep={employmentSubStep}
					setEmploymentSubStep={setEmploymentSubStep}
					formData={formData}
					handleChange={handleChange}
					employmentProvinces={employmentProvinces}
					company={company}
					dataRefresh={dataRefresh}
					isEditMode
				/>
			),
		},
		{
			id: 2,
			name: "Pay",
			content: <PayInfo formData={formData} handleChange={handleChange} isEditMode />,
		},
		{
			id: 3,
			name: "Benefits",
			content: (
				<BenefitInfo
					formData={formData}
					handleChange={handleChange}
					benefitsSubStep={benefitsSubStep}
					setBenefitsSubStep={setBenefitsSubStep}
					isEditMode
				/>
			),
		},
		{
			id: 4,
			name: "Government",
			content: (
				<GovernmentInfo
					governmentSubStep={governmentSubStep}
					setGovernmentSubStep={setGovernmentSubStep}
					formData={formData}
					handleChange={handleChange}
					governmentProvinces={governmentProvinces}
					isEditMode
				/>
			),
		},
		{
			id: 5,
			name: "Banking",
			content: (
				<BankingInfo
					bankingSubStep={bankingSubStep}
					setBankingSubStep={setBankingSubStep}
					formData={formData}
					handleChange={handleChange}
					isEditMode
				/>
			),
		},
	];

	return (
		<PageLayout title="Employee Info">
			<HStack spacing="1em" mt="1em" justifyContent={"space-between"}>
				<HStack spacing="1em" justifyContent={"space-between"}>
					<Avatar
						borderRadius="10%"
						// onClick={handleToggle}
						name={employeeName}
						src=""
						boxSize="15"
					/>
					<VStack spacing={0} align={"start"}>
						<TextTitle size="sm" title={employeeName} />
						<NormalTextTitle size="xs" title={employeeID} />
						{isActivePayroll && <ActiveBadge title={"Payroll Activated"} />}
					</VStack>
				</HStack>
				<Spacer />
				<EmpProfileSearch
					filteredEmployees={filteredEmployees}
					setFilteredEmployees={setFilteredEmployees}
					setUserId={setUserId}
					setEmployee={setEmployee}
					employees={employees}
				/>
			</HStack>
			<Tabs
				index={tabIndex}
				onChange={setTabIndex}
				variant="enclosed"
				colorScheme="purple"
				display="flex"
				flexDirection="column"
				height="100%"
				sx={tabStyleCss}
			>
				<TabList bg="gray.50" px={6} pt={5} pb={2} justifyContent="space-between">
					{EMP_INFO_TABS.map(({ name }) => (
						<Tab
							w="100%"
							key={name}
							fontWeight="semibold"
							px={8}
							_selected={{ color: "white", bg: "var(--banner_bg)" }}
						>
							{name}
						</Tab>
					))}
				</TabList>

				<TabPanels flex="1" overflow="hidden">
					{EMP_INFO_TABS.map(({ name, content }, i) => (
						<TabPanel key={`${name}_content_${i}`}>{content}</TabPanel>
					))}
				</TabPanels>
			</Tabs>
		</PageLayout>
	);
};

export default Employees;
