import useLoggedInUser from "hooks/useLoggedInUser";
import { createContext, useEffect, useReducer } from "react";
import { authReducer } from "./reducer";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, {
		user: null,
	});

	const loggedInUser = useLoggedInUser();

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
