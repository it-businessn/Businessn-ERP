import { buildUserInfo } from "models";
import LocalStorageService from "services/LocalStorageService";

export const saveUser = (info) => {
	const user = buildUserInfo(info);
	LocalStorageService.setItem("user", user);
};

export const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
		case "UPDATE_USER": {
			const user = buildUserInfo(action.payload);
			saveUser(action.payload);
			return { user };
		}

		case "LOGOUT":
			LocalStorageService.removeItem("user");
			return { user: null };

		default:
			return state;
	}
};
