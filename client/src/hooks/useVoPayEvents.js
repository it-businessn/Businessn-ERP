import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useVoPayEvents() {
	const [eventData, setEventData] = useState(null);

	useEffect(() => {
		const socket = io("http://localhost:5000/api/vopay-webhook");

		socket.on("account_status_update", (event) => {
			console.log("Received VoPay event:", event);
			setEventData(event);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return eventData;
}
