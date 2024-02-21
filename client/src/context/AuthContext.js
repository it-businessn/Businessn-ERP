import { buildUserInfo } from "models";
import { createContext, useEffect, useReducer } from "react";
import LocalStorageService from "services/LocalStorageService";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
		case "UPDATE_USER": {
			const user = buildUserInfo(action.payload);
			LocalStorageService.setItem("user", user);
			return { user: action.payload };
		}

		case "LOGOUT":
			localStorage.removeItem("user");
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
		const user = JSON.parse(localStorage.getItem("user"));
		if (!user) return;
		dispatch({ type: "LOGIN", payload: user });
	}, []);

	return (
		<AuthContext.Provider value={{ ...state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
