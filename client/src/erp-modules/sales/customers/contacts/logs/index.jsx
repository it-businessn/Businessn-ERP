import { VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ActivityService from "services/ActivityService";
import AddLogForm from "./AddLogForm";
import LogActivityList from "./LogActivityList";

const Logs = ({ contactId, user }) => {
	const [activities, setActivities] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [logActivity, setLogActivity] = useState({
		type: "meeting",
		duration: 0,
		description: "",
		createdBy: user?._id,
		contactId,
	});

	useEffect(() => {
		const fetchActivitiesByContactId = async () => {
			try {
				const response = await ActivityService.getActivitiesByContactId(
					contactId,
				);
				setActivities(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchActivitiesByContactId();
	}, [contactId, refresh]);

	const saveActivity = async (activity) => {
		try {
			await ActivityService.addActivity(activity);
			setRefresh((prev) => !prev);
			setLogActivity((prev) => ({
				...prev,
				duration: 0,
				type: "meeting",
				description: "",
			}));
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
			/>
			{activities.length && <LogActivityList activities={activities} />}
		</VStack>
	);
};

export default Logs;
