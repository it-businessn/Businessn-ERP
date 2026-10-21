import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// NEW-15 / CHANGES.md API #16: the server requires the access token in the socket.io
// handshake and only delivers "vopay-event" to rooms of the user's companies.
// Connect to the API origin instead of a hard-coded localhost namespace.
const socketOrigin = () => {
	try {
		return new URL(process.env.REACT_APP_BASE_URL).origin;
	} catch (error) {
		return window.location.origin;
	}
};

export default function useVoPayEvents(companyName) {
	const [eventData, setEventData] = useState(null);

	useEffect(() => {
		const socket = io(socketOrigin(), {
			auth: { token: sessionStorage.getItem("accessToken"), companyName },
		});

		socket.on("vopay-event", (event) => {
			setEventData(event);
		});

		return () => {
			socket.disconnect();
		};
	}, [companyName]);

	return eventData;
}
