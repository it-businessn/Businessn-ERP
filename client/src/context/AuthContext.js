import { createContext, useEffect, useReducer } from "react";
import { loggedInUser } from "utils/common";
import { authReducer } from "./reducer";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, {
		user: null,
	});

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
