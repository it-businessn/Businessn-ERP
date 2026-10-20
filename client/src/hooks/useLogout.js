import LocalStorageService from "services/LocalStorageService";
import LoginService from "services/LoginService";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
	const { dispatch } = useAuthContext();

	const logout = async (userId) => {
		try {
			// Call the server logout endpoint to record the logout time
			if (userId) {
				await LoginService.signOut(userId);
			}
		} catch (error) {
			// Non-fatal: still clear local session even if server call fails
			console.error("Logout server call failed:", error?.message);
		} finally {
			// FIX: Removed import of non-existent useWorkoutsContext which crashed the app.
			// Clear local storage and auth context state.
			sessionStorage.clear();
			sessionStorage.removeItem("accessToken");
			LocalStorageService.clear();
			dispatch({ type: "LOGOUT" });
		}
	};

	return { logout };
};
