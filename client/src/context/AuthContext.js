import { buildUserInfo } from "models";
import { createContext, useEffect, useReducer } from "react";
import LocalStorageService from "services/LocalStorageService";

export const AuthContext = createContext();

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

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, {
		user: null,
	});

	useEffect(() => {
		const user = LocalStorageService.getItem("user");
		if (!user) return;
		dispatch({ type: "LOGIN", payload: user });
	}, []);

	return (
		<AuthContext.Provider value={{ ...state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
