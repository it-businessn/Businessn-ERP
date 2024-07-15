import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";

const useSelectUser = (user) => {
	const [selectedUser, setSelectedUser] = useState(user);

	useEffect(() => {
		LocalStorageService.setItem("selectedUser", selectedUser);

		document.dispatchEvent(
			new CustomEvent("selectedUserChanged", {
				detail: selectedUser,
			}),
		);
	}, [selectedUser]);

	useEffect(() => {
		const handleSelectedUserChange = (event) => {
			setSelectedUser(event.detail);
		};
		document.addEventListener("selectedUserChanged", handleSelectedUserChange);

		return () => {
			document.removeEventListener(
				"selectedUserChanged",
				handleSelectedUserChange,
			);
		};
	}, []);

	return { selectedUser, setSelectedUser };
};

export default useSelectUser;
