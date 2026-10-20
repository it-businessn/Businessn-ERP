import { useState } from "react";
import LoginService from "services/LoginService";
import { buildUserInfo, storeUser } from "utils/common";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const { dispatch } = useAuthContext();

	const login = async (values) => {
		setIsLoading(true);
		setError(null);
		try {
			const { data, status } = await LoginService.signIn(values);

			if (status === 200) {
				const { user, existingCompanyUser, accessToken, refreshToken } = data;

				// FIX: Store tokens (was missing — only dispatching login without persisting tokens)
				sessionStorage.setItem("accessToken", accessToken);
				localStorage.setItem("refreshToken", refreshToken);

				user.companyId = existingCompanyUser;
				const userInfo = buildUserInfo(user);
				storeUser(userInfo);

				dispatch({ type: "LOGIN", payload: userInfo });
			}
		} catch (error) {
			setError(error?.response?.data?.message || "Login failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return { login, isLoading, error };
};
