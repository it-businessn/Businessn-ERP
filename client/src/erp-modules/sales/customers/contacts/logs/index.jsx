import { VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ActivityService from "services/ActivityService";
import AddLogForm from "./AddLogForm";
import LogActivityList from "./LogActivityList";

const Logs = ({ contactId, user, company, currentTab }) => {
	const [activities, setActivities] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const initialFormData = {
		type: "Email",
		email: "",
		phone: "",
		duration: 0,
		description: "",
		linkedInContact: "",
		createdBy: user?._id,
		contactId,
		companyName: company,
	};
	const [logActivity, setLogActivity] = useState(initialFormData);
	const handleInputChange = (e) => {
		setLogActivity({ ...logActivity, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		const fetchActivitiesByContactId = async () => {
			try {
				const { data } = await ActivityService.getActivitiesByContactId(contactId);
				setActivities(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (currentTab === 1) {
			fetchActivitiesByContactId();
		}
	}, [contactId, refresh, currentTab]);

	const saveActivity = async (activity) => {
		try {
			await ActivityService.addActivity(activity);
			setRefresh((prev) => !prev);
			setLogActivity(initialFormData);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<VStack spacing="4" p="4" width="100%">
			<AddLogForm
				onSave={saveActivity}
				logActivity={logActivity}
				setLogActivity={setLogActivity}
				handleInputChange={handleInputChange}
			/>
			{activities.length && <LogActivityList activities={activities} />}
		</VStack>
	);
};

export default Logs;
