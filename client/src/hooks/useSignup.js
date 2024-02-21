import { buildUserInfo } from "models";
import { useState } from "react";
import * as api from "services";
import LocalStorageService from "services/LocalStorageService";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const { dispatch } = useAuthContext();

	const signup = async (values) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await api.signUp(values);

			if (response.status === 200) {
				dispatch({ type: "LOGIN", payload: response.data });
				LocalStorageService.setItem("user", buildUserInfo(response.data));
				setIsLoading(false);
			}
		} catch (error) {
			console.log(error);
			setIsLoading(false);
			setError(error.response.data.error);
		}
	};

	return { signup, isLoading, error };
};
