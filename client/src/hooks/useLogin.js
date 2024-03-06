import { useState } from "react";
import LoginService from "services/LoginService";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(null);

	const { dispatch } = useAuthContext();
	const login = async (values) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await LoginService.signIn(values);
			const json = response.data;
			if (response.status === 200) {
				dispatch({ type: "LOGIN", payload: json });
			}
		} catch (error) {
			console.log(error);
			setError(error.response.data.error);
		} finally {
			setIsLoading(false);
		}
	};

	return { login, isLoading, error };
};
