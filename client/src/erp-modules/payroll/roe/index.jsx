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
import useSelectedCompanyInfo from "hooks/useSelectedCompanyInfo";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSave } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import SettingService from "services/SettingService";
import UserService from "services/UserService";
import EarningsInfo from "./EarningsInfo";
import EmployeeInfo from "./EmployeeInfo";
import EmployerInfo from "./EmployerInfo";
import EmploymentInfo from "./EmploymentInfo";
import ReviewInfo from "./ReviewInfo";

const ROE = () => {
	const toast = useToast();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const { selectedPayGroupOption } = usePaygroup(company, false);
	const employees = useCompanyEmployees(company, null, selectedPayGroupOption);
	const { payGroupSchedule } = usePaygroup(company, false);
	const companyInfo = useSelectedCompanyInfo(company);
	const [admins, setAdmins] = useState(null);

	const initialFormData = {
		companyName: company,
		empId: "",
		employee: "",
		empInfo: {
			firstName: "",
			lastName: "",
			middleName: "",
			SIN: "",
			streetAddress: "",
			streetAddressSuite: "",
			city: "",
			province: "",
			country: "",
			postalCode: "",
		},
		employmentInfo: {
			employmentStartDate: "",
			employmentLeaveDate: new Date(),
			finalPayPeriodEndDate: "",
			recallDate: "",
			expectedRecallDate: "Unknown",
			reasonCode: "",
			positions: [],
		},
		employerInfo: {
			name: "",
			registration_number: "",
			address: "",
			contactName: loggedInUser?.fullName,
			issuerName: loggedInUser?.fullName,
			contactTelNumber: "",
			contactExtNumber: "",
			issuerTelNumber: "",
			issuerExtNumber: "",
			preferredCommunication: "English",
		},
	};
	const [formData, setFormData] = useState(initialFormData);
	const [tabIndex, setTabIndex] = useState(0);

	useEffect(() => {
		const fetchEmployeeInfo = async () => {
			try {
				const [profileRes, employmentRes, companyInfo] = await Promise.all([
					PayrollService.getEmployeeProfileInfo(company, formData?.empId),
					PayrollService.getEmployeeEmploymentInfo(company, formData?.empId),
					SettingService.getCompanyInfo(company),
				]);
				//for emp saved roe info
				// const { data } = await PayrollService.getEmployeeROEEmploymentInfo(company, roeEmpId);

				setFormData((prev) => ({
					...prev,
					empInfo: {
						...prev.empInfo,
						firstName: profileRes?.data?.firstName,
						lastName: profileRes?.data?.lastName,
						middleName: profileRes?.data?.middleName,
						SIN: profileRes?.data?.SIN,
						streetAddress: profileRes?.data?.streetAddress,
						streetAddressSuite: profileRes?.data?.streetAddressSuite,
						city: profileRes?.data?.city,
						province: profileRes?.data?.province,
						country: profileRes?.data?.country,
						postalCode: profileRes?.data?.postalCode,
					},
					employmentInfo: {
						...prev.employmentInfo,
						positions: employmentRes?.data?.positions,
						employmentStartDate: employmentRes?.data?.employmentStartDate,
						employmentLeaveDate: employmentRes?.data?.employmentLeaveDate,
					},
					employerInfo: {
						...prev.employerInfo,
						name: companyInfo?.data?.name,
						registration_number: companyInfo?.data?.registration_number,
						address: companyInfo?.data?.address,
					},
				}));
			} catch (error) {
				console.error(error);
			}
		};

		if (formData?.empId) {
			fetchEmployeeInfo();
		}
		const fetchAllAdmins = async () => {
			try {
				const { data } = await UserService.getAllManagers(company);
				data?.map((emp) => (emp.fullName = emp?.empId?.fullName));
				setAdmins(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAdmins();
	}, [formData?.empId]);

	const ROE_TABS = [
		{
			name: "Employee Info",
			content: <EmployeeInfo formData={formData} setFormData={setFormData} />,
		},
		{
			name: "Employment Info",
			content: (
				<EmploymentInfo
					formData={formData}
					setFormData={setFormData}
					payGroupSchedule={payGroupSchedule}
				/>
			),
		},
		{
			name: "Employer Info",
			content: <EmployerInfo formData={formData} setFormData={setFormData} admins={admins} />,
		},
		{
			name: "Earnings Info",
			content: (
				<EarningsInfo
					formData={formData}
					setFormData={setFormData}
					company={company}
					roeEmpId={formData?.empId}
				/>
			),
		},
		{
			name: "Review",
			content: <ReviewInfo formData={formData} setFormData={setFormData} />,
		},
	];
	const isLastStep = tabIndex === ROE_TABS.length - 1;

	const handleSubmit = async () => {
		// try {
		// const { data } = await PayrollService.addEmployeeProfileInfo(formData);
		// 		const handleEmpROEInfo = async () => {
		// 	try {
		// 		if (!formData?.expectedRecallDate) {
		// 			formData.expectedRecallDate = "Unknown";
		// 		}
		// 		await PayrollService.addEmployeeROEEmploymentInfo(formData);
		// 		handleNext(tabId);
		// 		toast({
		// 			title: "Employment info updated successfully.",
		// 			status: "success",
		// 			duration: 1000,
		// 			isClosable: true,
		// 		});
		// 	} catch (error) {}
		// };	try {
		// 	await PayrollService.addEmployeeROEEmploymentInfo(formData);
		// 	handleNext(tabId);
		// } catch (error) {}
		// 	toast({
		// 		title: "Ticket submitted!",
		// 		description: "Your support request has been sent successfully.",
		// 		status: "success",
		// 		duration: 2000,
		// 		isClosable: true,
		// 	});
		// 	setTimeout(() => {
		// 		handleRedirect();
		// 	}, 2000);
		// } catch (error) {
		// 	toast({
		// 		title: "Something went wrong.",
		// 		description: "Please try again.",
		// 		status: "error",
		// 		duration: 3000,
		// 		isClosable: true,
		// 	});
		// }
	};

	const getNextButtonIcon = () => {
		if (tabIndex === ROE_TABS.length - 1) {
			return <FaSave />;
		}
		return <FaChevronRight />;
	};

	const getNextButtonAction = () => {
		if (isLastStep) {
			handleSubmit();
		} else {
			setTabIndex(tabIndex + 1);
		}
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
					if (value)
						setFormData(() => ({
							employee: value,
							empId: employees?.find((_) => _.fullName === value)?._id,
							companyName: company,
						}));
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
			<HStack spacing={4} justify="end" w={0.89}>
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
