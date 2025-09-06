import {
	Button,
	HStack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useToast,
} from "@chakra-ui/react";
import SelectFormControl from "components/ui/form/SelectFormControl";
import { tabStyleCss } from "erp-modules/payroll/onboard-user/customInfo";
import useCompany from "hooks/useCompany";
import useCompanyEmployees from "hooks/useCompanyEmployees";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSave } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import UserService from "services/UserService";
import { generatePayPeriodId } from "utils/convertDate";
import EarningsInfo from "./EarningsInfo";
import EmployeeInfo from "./employee-info/EmployeeInfo";
import EmployerInfo from "./employer-info/EmployerInfo";
import EmploymentInfo, { employeeSubSteps } from "./employment-info/EmploymentInfo";
import ReviewInfo from "./review/ReviewInfo";

const ROE = () => {
	const toast = useToast();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const { closestRecord, payGroupSchedule, selectedPayGroupOption } = usePaygroup(company, false);
	const employees = useCompanyEmployees(company, null, selectedPayGroupOption);
	const [admins, setAdmins] = useState(null);
	const [employmentSubStep, setEmploymentSubStep] = useState(0);

	const initialFormData = {
		companyName: company,
		empId: "",
		employee: "",
		payPeriodType: "",
		payPeriodId: "",
		empInfo: {
			firstName: "",
			lastName: "",
			middleName: "",
			SIN: "",
			SINIv: "",
			streetAddress: "",
			streetAddressSuite: "",
			city: "",
			province: "",
			country: "",
			postalCode: "",
		},
		employmentInfo: {
			employmentStartDate: "",
			employmentLeaveDate: "",
			finalPayPeriodEndDate: "",
			recallDate: "",
			expectedRecallDate: "",
			reasonCode: "",
			positions: [],
			vacationPayCode: "",
			vacationPayStartDate: null,
			vacationPayEndDate: null,
			vacationPayAmount: 0,
			statHolidays: [],
			otherMonies: [],
			specialPayments: [],
		},
		employerInfo: {
			name: loggedInUser?.companyId?.name,
			registration_number: loggedInUser?.companyId?.registration_number,
			address: loggedInUser?.companyId?.address,
			contactTelNumber: "",
			contactExtNumber: "",
			issuerTelNumber: "",
			issuerExtNumber: "",
			preferredCommunication: "E",
		},
		earningsInfo: { totalInsurableHours: 0, totalInsurableEarnings: 0, earningsData: null },
		comments: { message: "" },
		dateIssued: "",
	};
	const [formData, setFormData] = useState(initialFormData);
	const [tabIndex, setTabIndex] = useState(0);

	useEffect(() => {
		const fetchAllAdmins = async () => {
			try {
				const { data } = await UserService.getAllAdmin(company);
				data?.map((emp) => (emp.fullName = emp?.empId?.fullName));
				setAdmins(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAdmins();
	}, []);

	useEffect(() => {
		const fetchEmployeeInfo = async () => {
			try {
				const { data } = await PayrollService.getEmployeeROEEmploymentInfo(
					company,
					formData?.empId,
				);
				if (data) {
					setFormData({
						...formData,
						dateIssued: data?.createdOn,
						companyName: data?.companyName,
						empId: data?.empId,
						payPeriodType: data?.payPeriodType,
						payPeriodId: data?.payPeriodId,
						empInfo: {
							firstName: data?.firstName,
							lastName: data?.lastName,
							middleName: data?.middleName,
							SIN: data?.SIN,
							SINIv: data?.SINIv,
							streetAddress: data?.streetAddress,
							streetAddressSuite: data?.streetAddressSuite,
							city: data?.city,
							province: data?.province,
							country: data?.country,
							postalCode: data?.postalCode,
						},
						employmentInfo: {
							positions: data?.occupation,
							employmentStartDate: data?.employmentStartDate,
							employmentLeaveDate: data?.employmentLeaveDate,
							finalPayPeriodEndDate: data?.finalPayPeriodEndDate,
							recallDate: data?.recallDate,
							expectedRecallDate: data?.expectedRecallDate,
							reasonCode: data?.reasonCode,
							vacationPayCode: data?.vacationPayCode,
							vacationPayStartDate: data?.vacationPayStartDate,
							vacationPayEndDate: data?.vacationPayEndDate,
							vacationPayAmount: data?.vacationPayAmount,
							statHolidays: data?.statHolidayPay,
							otherMonies: data?.otherMoney,
							specialPayments: data?.specialPayments,
						},
						employerInfo: {
							...formData.employerInfo,
							contactName: data?.contactName,
							issuerName: data?.issuerName,
							contactTelNumber: data?.contactTelNumber,
							contactExtNumber: data?.contactExtNumber,
							issuerTelNumber: data?.issuerTelNumber,
							issuerExtNumber: data?.issuerExtNumber,
							preferredCommunication: data?.preferredCommunication,
						},
						earningsInfo: {
							earningsData: data?.insurableEarnings,
							totalInsurableHours: data?.totalInsurableHours,
							totalInsurableEarnings: data?.totalInsurableEarnings,
						},
						comments: { message: data?.reviewComments },
					});
				} else {
					const [profileRes, employmentRes, earningsInfo] = await Promise.all([
						PayrollService.getEmployeeProfileInfo(company, formData?.empId),
						PayrollService.getEmployeeEmploymentInfo(company, formData?.empId),
						PayrollService.getEmpEarningInfo(company, formData?.empId),
					]);
					setFormData({
						empInfo: {
							firstName: profileRes?.data?.firstName,
							lastName: profileRes?.data?.lastName,
							middleName: profileRes?.data?.middleName,
							SIN: profileRes?.data?.SIN,
							SINIv: profileRes?.data?.SINIv,
							streetAddress: profileRes?.data?.streetAddress,
							streetAddressSuite: profileRes?.data?.streetAddressSuite,
							city: profileRes?.data?.city,
							province: profileRes?.data?.province,
							country: profileRes?.data?.country,
							postalCode: profileRes?.data?.postalCode,
						},
						employmentInfo: {
							positions: employmentRes?.data?.positions,
							employmentStartDate: employmentRes?.data?.employmentStartDate,
							employmentLeaveDate: employmentRes?.data?.employmentLeaveDate,
						},
						employerInfo: {
							name: loggedInUser?.companyId?.name,
							registration_number: loggedInUser?.companyId?.registration_number,
							address: loggedInUser?.companyId?.address,
						},
						earningsInfo: {
							earningsData: earningsInfo?.data,
						},
					});
				}
			} catch (error) {
				console.error(error);
			}
		};

		if (formData?.empId) {
			fetchEmployeeInfo();
		}
	}, [formData?.empId]);

	const handleFieldChange = (section, field, value) => {
		if (field === "reasonCode") {
			setFormData({
				...formData,
				[section]: {
					...formData[section],
					expectedRecallDate: "",
					reasonCode: value,
				},
			});
		} else {
			setFormData({
				...formData,
				[section]: {
					...formData[section],
					[field]: value,
				},
			});
		}
	};

	const ROE_TABS = [
		{
			name: "Employee Info",
			content: <EmployeeInfo formData={formData} handleFieldChange={handleFieldChange} />,
		},
		{
			name: "Employment Info",
			content: (
				<EmploymentInfo
					employmentSubStep={employmentSubStep}
					setEmploymentSubStep={setEmploymentSubStep}
					formData={formData}
					payGroupSchedule={payGroupSchedule}
					handleFieldChange={handleFieldChange}
				/>
			),
		},
		{
			name: "Employer Info",
			content: (
				<EmployerInfo formData={formData} admins={admins} handleFieldChange={handleFieldChange} />
			),
		},
		{
			name: "Earnings Info",
			content: <EarningsInfo formData={formData} setFormData={setFormData} />,
		},
		{
			name: "Review",
			content: (
				<ReviewInfo
					formData={formData}
					setFormData={setFormData}
					handleFieldChange={handleFieldChange}
				/>
			),
		},
	];
	const isLastStep = tabIndex === ROE_TABS.length - 1;

	const handleSubmit = async () => {
		try {
			await PayrollService.addEmployeeROEEmploymentInfo(formData);
			toast({
				title: "Employee ROE created successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Something went wrong.",
				description: "Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const getNextButtonIcon = () => {
		if (tabIndex === ROE_TABS.length - 1) {
			return <FaSave />;
		}
		return <FaChevronRight />;
	};

	const handleNextTab = () => {
		if (tabIndex === 0) {
			setTabIndex(tabIndex + 1);
		} else if (tabIndex === 1 && employmentSubStep < employeeSubSteps?.length - 1) {
			setEmploymentSubStep(employmentSubStep + 1);
		} else {
			setTabIndex(tabIndex + 1);
		}
	};

	const getNextButtonAction = () => {
		if (isLastStep) {
			return handleSubmit();
		}
		handleNextTab();
	};

	return (
		<PageLayout title="Issue ROE">
			<SelectFormControl
				w="20%"
				valueParam="fullName"
				name="fullName"
				label=""
				placeholder="Choose Employee"
				valueText={formData?.employee || ""}
				handleChange={(e) => {
					const { value } = e.target;
					if (value) {
						setFormData({
							...formData,
							employee: value,
							empId: employees?.find((_) => _.fullName === value)?._id,
							companyName: company,
							payPeriodType: closestRecord?.frequency,
							payPeriodId: generatePayPeriodId(
								closestRecord?.payPeriodStartDate,
								closestRecord?.payPeriodEndDate,
							),
						});
					}
				}}
				options={employees}
			/>
			<Tabs
				minH="20em"
				index={tabIndex}
				onChange={setTabIndex}
				variant="enclosed"
				colorScheme="purple"
				display="flex"
				flexDirection="column"
				sx={tabStyleCss}
				isLazy
				lazyBehavior="unmount"
			>
				<TabList bg="gray.50" px={6} pt={5} pb={2}>
					{ROE_TABS.map(({ name }) => (
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
					{ROE_TABS.map(({ name, content }, i) => (
						<TabPanel key={`${name}_content_${i}`}>{content}</TabPanel>
					))}
				</TabPanels>
			</Tabs>
			<HStack spacing={4} justify="end">
				{tabIndex > 0 && (
					<Button
						leftIcon={<FaChevronLeft />}
						onClick={() => setTabIndex(tabIndex - 1)}
						colorScheme="gray"
						variant="outline"
						px={6}
					>
						Back
					</Button>
				)}

				<Button
					rightIcon={getNextButtonIcon()}
					onClick={() => getNextButtonAction()}
					bg={"var(--banner_bg)"}
					color="white"
					_hover={{ bg: "#4a2b4a" }}
					px={6}
				>
					{isLastStep ? "Submit" : "Next"}
				</Button>
			</HStack>
		</PageLayout>
	);
};

export default ROE;
