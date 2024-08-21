import { useEffect, useState } from "react";
import CalendarService from "services/CalendarService";

const useCompanyEvents = (user, company) => {
	const [events, setEvents] = useState(null);

	useEffect(() => {
		const fetchAllEvents = async () => {
			try {
				const response = await CalendarService.getCompEvents(company);
				setEvents(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEvents();
	}, [user._id, company]);
	return events;
};

export default useCompanyEvents;
