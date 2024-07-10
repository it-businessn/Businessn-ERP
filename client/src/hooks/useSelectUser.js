import { useEffect } from "react";
import LocalStorageService from "services/LocalStorageService";

const useSelectUser = (selectedUser) => {
	useEffect(() => {
		LocalStorageService.setItem("selectedUser", selectedUser);

		document.dispatchEvent(
			new CustomEvent("selectedUserChanged", {
				detail: selectedUser,
			}),
		);
	}, [selectedUser]);
	return null;
};

export default useSelectUser;
