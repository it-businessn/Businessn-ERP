import { Button, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "@chakra-ui/react";
import { tabStyleCss } from "erp-modules/payroll/onboard-user/customInfo";
import PageLayout from "layouts/PageLayout";
import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import UserService from "services/UserService";
import EarningsInfo from "./EarningsInfo";
import EmployeeInfo from "./employee-info/EmployeeInfo";
import EmployerInfo from "./employer-info/EmployerInfo";
import EmploymentInfo from "./employment-info/EmploymentInfo";
import { returnDateAllowed } from "./employment-info/FinalPayInfo";
import ReviewInfo from "./review/ReviewInfo";
import {
	DEFAULT_RECALL,
	employeePayGroup,
	finalPayPeriodFor,
	isReturnDate,
	payPeriodOptions as buildPayPeriodOptions,
	payPeriodTypeOf,
	stepErrors,
	toPayload,
} from "./roeUtils";

const blankForm = (company) => ({
	companyName: company,
	empId: "",
	payPeriodType: "",
	payPeriodId: "",
	empInfo: {},
	employmentInfo: {
		positions: [],
		expectedRecallDate: DEFAULT_RECALL,
		statHolidays: [],
		otherMonies: [],
		specialPayments: [],
	},
	employerInfo: { preferredCommunication: "E" },
	earningsInfo: { totalInsurableHours: 0, totalInsurableEarnings: 0, earningsData: [] },
	comments: { message: "" },
	dateIssued: "",
});

/** A saved ROE back into the form. */
const fromSaved = (data, company) => ({
	...blankForm(company),
	empId: data.empId,
	payPeriodType: data.payPeriodType,
	payPeriodId: data.payPeriodId,
	payrollReferenceNumber: data.payrollReferenceNumber,
	craBusinessNumber: data.craBusinessNumber,
	dateIssued: data.submittedOn || data.createdOn,
	empInfo: {
		firstName: data.firstName,
		middleName: data.middleName,
		lastName: data.lastName,
		SIN: data.SIN,
		streetAddress: data.streetAddress,
		streetAddressSuite: data.streetAddressSuite,
		city: data.city,
		province: data.province,
		country: data.country,
		postalCode: data.postalCode,
	},
	employmentInfo: {
		positions: data.occupation || [],
		employmentStartDate: data.employmentStartDate,
		employmentLeaveDate: data.employmentLeaveDate,
		finalPayPeriodEndDate: data.finalPayPeriodEndDate,
		recallDate: data.recallDate,
		expectedRecallDate: data.expectedRecallDate || DEFAULT_RECALL,
		reasonCode: data.reasonCode,
		vacationPayCode: data.vacationPayCode,
		vacationPayStartDate: data.vacationPayStartDate,
		vacationPayEndDate: data.vacationPayEndDate,
		vacationPayAmount: data.vacationPayAmount,
		statHolidays: data.statHolidayPay || [],
		otherMonies: data.otherMoney || [],
		specialPayments: data.specialPayments || [],
	},
	employerInfo: {
		contactName: data.contactName,
		issuerName: data.issuerName,
		contactTelNumber: data.contactTelNumber,
		contactExtNumber: data.contactExtNumber,
		issuerTelNumber: data.issuerTelNumber,
		issuerExtNumber: data.issuerExtNumber,
		preferredCommunication: data.preferredCommunication || "E",
	},
	earningsInfo: {
		earningsData: data.insurableEarnings || [],
		totalInsurableHours: data.totalInsurableHours,
		totalInsurableEarnings: data.totalInsurableEarnings,
	},
	comments: { message: data.reviewComments || "" },
});

/** A new ROE filled in from the employee's profile and employment info. */
const fromProfile = (company, empId, profile, employment, defaultPerson) => ({
	...blankForm(company),
	empId,
	empInfo: {
		firstName: profile?.firstName,
		middleName: profile?.middleName,
		lastName: profile?.lastName,
		SIN: profile?.SIN,
		streetAddress: profile?.streetAddress,
		streetAddressSuite: profile?.streetAddressSuite,
		city: profile?.city,
		province: profile?.province,
		country: profile?.country,
		postalCode: profile?.postalCode,
	},
	employmentInfo: {
		...blankForm(company).employmentInfo,
		employeeNo: employment?.employeeNo,
		positions: employment?.positions || [],
		employmentStartDate: employment?.employmentStartDate,
		employmentLeaveDate: employment?.employmentLeaveDate,
	},
	employerInfo: {
		preferredCommunication: "E",
		contactName: defaultPerson,
		issuerName: defaultPerson,
	},
});

const NO_STEPS_DONE = { employee: false, personal: false, employment: false, employer: false, earnings: false };
const FIRST_SECTIONS = {
	employee: true,
	personal: false,
	tenure: true,
	finalPay: true,
	payments: false,
	employer: true,
	earnings: true,
};

// ROE-01: Issue ROE. Choose employee -> personal info -> employment info ->
// employer -> earnings -> review and submit. Each step is confirmed before the
// next tab opens; a confirmed step folds up and can be opened again.
const ROE = () => {
	const toast = useToast();
	const company = LocalStorageService.getItem("selectedCompany");
	const loggedInUser = LocalStorageService.getItem("user");
	const [employees, setEmployees] = useState(null);
	const [admins, setAdmins] = useState(null);
	const [payGroups, setPayGroups] = useState(null);
	const [employer, setEmployer] = useState(null);
	const [selectedEmpId, setSelectedEmpId] = useState("");
	const [confirmedEmpId, setConfirmedEmpId] = useState("");
	const [paidPeriods, setPaidPeriods] = useState([]);
	const [frequency, setFrequency] = useState("");
	const [submittedROE, setSubmittedROE] = useState(null);
	const [loading, setLoading] = useState({ employee: false, earnings: false, saving: false });
	const [formData, setFormData] = useState(blankForm(company));
	const [tabIndex, setTabIndex] = useState(0);
	const [done, setDone] = useState(NO_STEPS_DONE);
	const [sections, setSections] = useState(FIRST_SECTIONS);
	const [errors, setErrors] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		const load = async () => {
			try {
				const [emps, adminRes, groups, employerRes] = await Promise.all([
					UserService.getCompanyUsers(company),
					UserService.getAllAdmin(company),
					PayrollService.getAllPaygroups(company),
					PayrollService.getROEEmployerInfo(company),
				]);
				// every employee of the company, active or not
				setEmployees(
					(emps?.data || [])
						.filter((e) => e?.empId?._id)
						.map((e) => ({ _id: e.empId._id, fullName: e.empId.fullName })),
				);
				const list = (adminRes?.data || [])
					.map((a) => ({ fullName: a?.empId?.fullName }))
					.filter((a) => a.fullName);
				if (loggedInUser?.fullName && !list.some((a) => a.fullName === loggedInUser.fullName))
					list.unshift({ fullName: loggedInUser.fullName });
				setAdmins(list);
				setPayGroups(groups?.data || []);
				setEmployer(employerRes?.data || null);
			} catch (error) {
				console.error(error);
			}
		};
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company]);

	const payGroup = useMemo(
		() => employeePayGroup(payGroups, formData?.employmentInfo?.positions),
		[payGroups, formData?.employmentInfo?.positions],
	);
	const periodOptions = useMemo(() => buildPayPeriodOptions(payGroup, paidPeriods), [payGroup, paidPeriods]);
	const payPeriodType = payPeriodTypeOf(formData?.payPeriodType || frequency || payGroup?.scheduleFrequency);

	const toggleSection = (key) => setSections((s) => ({ ...s, [key]: !s[key] }));

	const handleFieldChange = (section, field, value) => {
		setFormData((prev) => {
			const next = { ...prev[section], [field]: value };
			if (section === "employmentInfo") {
				if (field === "employmentLeaveDate") {
					// block 12: the pay period that contains the last day worked
					const period = finalPayPeriodFor(periodOptions, value);
					if (period) next.finalPayPeriodEndDate = period.payPeriodEndDate;
				}
				if (field === "reasonCode" && isReturnDate(next.expectedRecallDate) && !returnDateAllowed(value)) {
					next.expectedRecallDate = DEFAULT_RECALL;
					next.recallDate = "";
				}
				if (field === "expectedRecallDate" && !isReturnDate(value)) next.recallDate = "";
			}
			return { ...prev, [section]: next };
		});
		// a change to an earlier step has to be confirmed again
		if (section === "employmentInfo" && ["employmentLeaveDate", "employmentStartDate", "finalPayPeriodEndDate"].includes(field))
			setDone((d) => ({ ...d, earnings: false }));
	};

	const loadEarnings = async (data = formData) => {
		setLoading((l) => ({ ...l, earnings: true }));
		try {
			const { data: res } = await PayrollService.getEmpEarningInfo(company, data.empId, {
				finalPayPeriodEndDate: data.employmentInfo?.finalPayPeriodEndDate,
				firstDayWorked: data.employmentInfo?.employmentStartDate,
				frequency: payGroup?.scheduleFrequency || frequency || undefined,
			});
			setFormData((prev) => ({
				...prev,
				payPeriodType: res?.scheduleFrequency || prev.payPeriodType,
				earningsInfo: {
					earningsData: res?.periods || [],
					totalInsurableHours: res?.totalInsurableHours || 0,
					totalInsurableEarnings: res?.totalInsurableEarnings || 0,
				},
			}));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading((l) => ({ ...l, earnings: false }));
		}
	};

	const onConfirmSelection = async () => {
		if (!selectedEmpId) return;
		setLoading((l) => ({ ...l, employee: true }));
		try {
			const [roeRes, profileRes, employmentRes, earningsRes] = await Promise.all([
				PayrollService.getEmployeeROEEmploymentInfo(company, selectedEmpId),
				PayrollService.getEmployeeProfileInfo(company, selectedEmpId),
				PayrollService.getEmployeeEmploymentInfo(company, selectedEmpId),
				PayrollService.getEmpEarningInfo(company, selectedEmpId),
			]);
			const roe = roeRes?.data;
			setPaidPeriods(earningsRes?.data?.paidPeriods || []);
			setFrequency(earningsRes?.data?.scheduleFrequency || "");
			const submitted = roe?.status === "Submitted" ? roe : null;
			setSubmittedROE(submitted);
			setIsSubmitted(false);
			let next;
			if (roe && !submitted) {
				// continue the draft
				next = fromSaved(roe, company);
				next.employmentInfo.employeeNo = employmentRes?.data?.employeeNo;
			} else {
				next = fromProfile(company, selectedEmpId, profileRes?.data, employmentRes?.data, loggedInUser?.fullName);
			}
			setFormData(next);
			setConfirmedEmpId(selectedEmpId);
			setDone({ ...NO_STEPS_DONE, employee: true });
			// stays open when an ROE was already submitted, to show the choice
			setSections({ ...FIRST_SECTIONS, employee: Boolean(submitted), personal: true });
			setErrors({});
		} catch (error) {
			toast({ title: "Could not load the employee.", status: "error", duration: 3000, isClosable: true });
		} finally {
			setLoading((l) => ({ ...l, employee: false }));
		}
	};

	const onViewSubmitted = () => {
		setFormData(fromSaved(submittedROE, company));
		setIsSubmitted(true);
		setDone({ employee: true, personal: true, employment: true, employer: true, earnings: true });
		setTabIndex(4);
	};

	const onStartNew = () => setSubmittedROE(null);

	const confirmStep = (step, nextTab, collapse) => {
		const stepError = stepErrors[step]?.(formData) || [];
		setErrors((e) => ({ ...e, [step]: stepError }));
		if (stepError.length) return false;
		setDone((d) => ({ ...d, [step]: true }));
		setSections((s) => ({ ...s, ...collapse }));
		if (nextTab !== undefined) setTabIndex(nextTab);
		return true;
	};

	const onConfirmPersonal = () => confirmStep("personal", 1, { personal: false });
	const onSaveEmployment = () => confirmStep("employment", 2, { tenure: false, finalPay: false, payments: false });
	const onConfirmEmployer = async () => {
		if (confirmStep("employer", 3, { employer: false })) await loadEarnings();
	};

	const onConfirmEarnings = async () => {
		setDone((d) => ({ ...d, earnings: true }));
		setSections((s) => ({ ...s, earnings: false }));
		setTabIndex(4);
		if (isSubmitted) return; // viewing a submitted ROE: nothing to save
		// keep a draft so the ROE can be finished later
		try {
			await PayrollService.addEmployeeROEEmploymentInfo(toPayload(formData));
		} catch (error) {
			console.error(error);
		}
	};

	const onSubmit = async () => {
		setLoading((l) => ({ ...l, saving: true }));
		try {
			const { data } = await PayrollService.addEmployeeROEEmploymentInfo(toPayload(formData, { submit: true }));
			setIsSubmitted(true);
			setFormData((prev) => ({ ...prev, dateIssued: data?.submittedOn || new Date().toISOString() }));
			setSubmittedROE(data);
			toast({ title: "ROE submitted.", status: "success", duration: 2000, isClosable: true });
		} catch (error) {
			toast({
				title: "The ROE was not submitted.",
				description: error?.response?.data?.message || "Please try again.",
				status: "error",
				duration: 4000,
				isClosable: true,
			});
		} finally {
			setLoading((l) => ({ ...l, saving: false }));
		}
	};

	// re-read the earnings when the earnings tab opens after a change
	useEffect(() => {
		if (tabIndex === 3 && done.employer && !done.earnings && formData.empId) loadEarnings();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tabIndex]);

	const stepProps = { sections, toggleSection, done };
	const tabs = [
		{
			name: "Employee Info",
			enabled: true,
			content: (
				<EmployeeInfo
					employees={employees}
					selectedEmpId={selectedEmpId}
					setSelectedEmpId={setSelectedEmpId}
					confirmedEmpId={confirmedEmpId}
					onConfirmSelection={onConfirmSelection}
					isLoading={loading.employee}
					submittedROE={submittedROE && !isSubmitted ? submittedROE : null}
					onViewSubmitted={onViewSubmitted}
					onStartNew={onStartNew}
					formData={formData}
					handleFieldChange={handleFieldChange}
					onConfirmPersonal={onConfirmPersonal}
					errors={errors.personal}
					{...stepProps}
				/>
			),
		},
		{
			name: "Employment Info",
			enabled: done.personal,
			content: (
				<EmploymentInfo
					formData={formData}
					handleFieldChange={handleFieldChange}
					payPeriodOptions={periodOptions}
					onSave={onSaveEmployment}
					errors={errors.employment}
					{...stepProps}
				/>
			),
		},
		{
			name: "Employer Info",
			enabled: done.employment,
			content: (
				<EmployerInfo
					formData={formData}
					employer={employer}
					admins={admins}
					handleFieldChange={handleFieldChange}
					onConfirm={onConfirmEmployer}
					errors={errors.employer}
					{...stepProps}
				/>
			),
		},
		{
			name: "Earnings Info",
			enabled: done.employer,
			content: (
				<EarningsInfo
					formData={{ ...formData, payPeriodTypeLabel: payPeriodType ? `${payPeriodType.code} - ${payPeriodType.name}` : "" }}
					isLoading={loading.earnings}
					onConfirm={onConfirmEarnings}
					{...stepProps}
				/>
			),
		},
		{
			name: "Review",
			enabled: done.earnings,
			content: (
				<ReviewInfo
					formData={formData}
					employer={employer}
					payPeriodType={payPeriodType}
					handleFieldChange={handleFieldChange}
					isSubmitted={isSubmitted}
					submittedOn={formData?.dateIssued}
					onSubmit={onSubmit}
					isSaving={loading.saving}
				/>
			),
		},
	];

	return (
		<PageLayout title="Issue ROE">
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
			>
				<TabList bg="gray.50" px={6} pt={5} pb={2}>
					{tabs.map(({ name, enabled }) => (
						<Tab
							w="100%"
							key={name}
							fontWeight="semibold"
							px={8}
							isDisabled={!enabled}
							_selected={{ color: "white", bg: "var(--banner_bg)" }}
						>
							{name}
						</Tab>
					))}
				</TabList>
				<TabPanels flex="1">
					{tabs.map(({ name, content }) => (
						<TabPanel key={name}>{content}</TabPanel>
					))}
				</TabPanels>
			</Tabs>
			{tabIndex > 0 && (
				<HStack justify="start" px={4}>
					<Button
						leftIcon={<FaChevronLeft />}
						onClick={() => setTabIndex(tabIndex - 1)}
						colorScheme="gray"
						variant="outline"
					>
						Back
					</Button>
				</HStack>
			)}
		</PageLayout>
	);
};

export default ROE;
