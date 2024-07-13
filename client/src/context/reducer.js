import { buildUserInfo } from "models";
import LocalStorageService from "services/LocalStorageService";
import { storeUser } from "utils/common";

export const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
		case "UPDATE_USER": {
			const user = buildUserInfo(action.payload);
			storeUser(user);
			return { user };
		}

		case "LOGOUT":
			LocalStorageService.removeItem("user");
			return { user: null };

		default:
			return state;
	}
};
