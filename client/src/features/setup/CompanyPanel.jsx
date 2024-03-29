import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import { COMPANY_SETUP_TAB } from "./data";

const CompanyPanel = () => {
	const [departments, setDepartments] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const [deptName, setDeptName] = useState("");
	const [deptDescription, setDeptDescription] = useState("");

	useEffect(() => {
		const fetchAllDepartments = async () => {
			try {
				const response = await SettingService.getAllDepartments();
				setDepartments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllDepartments();
	}, [isRefresh]);

	const handleDepartmentSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addDepartment({
				name: deptName,
				description: deptDescription,
			});
			setIsRefresh(true);
			setDeptName("");
			setDeptDescription("");
		} catch (error) {
			console.log("An error occurred while submitting the application.");
		} finally {
			setIsSubmitting(false);
		}
	};
	const [currentTab, setCurrentTab] = useState(0);

	const handleTabChange = (index) => {
		setCurrentTab(index);
	};
	return (
		<>
			<Tabs
				variant="soft-rounded"
				colorScheme="blue"
				index={currentTab}
				onChange={handleTabChange}
			>
				<TabList>
					{COMPANY_SETUP_TAB.map((item) => (
						<Tab key={item.type}>{item.type}</Tab>
					))}
				</TabList>

				{/* <TabPanels>
					{COMPANY_SETUP_TAB.map((item) => (
						<TabPanel key={item.id}>
							{currentTab === item.id && item.name}
						</TabPanel>
					))}
				</TabPanels> */}
			</Tabs>
		</>
	);
};

export default CompanyPanel;
