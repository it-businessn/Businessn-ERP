import { createContext, useEffect, useReducer } from "react";
import LocalStorageService from "services/LocalStorageService";
import { authReducer } from "./reducer";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, {
		user: null,
	});
	const loggedInUser = LocalStorageService.getItem("user");

	useEffect(() => {
		if (!loggedInUser) return;
		dispatch({ type: "LOGIN", payload: loggedInUser });
	}, []);

	return (
		<AuthContext.Provider value={{ ...state, dispatch, user: loggedInUser }}>
			{children}
		</AuthContext.Provider>
	);
};
