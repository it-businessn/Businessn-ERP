import LocalStorageService from "services/LocalStorageService";

const useLoggedInUser = () => {
	return LocalStorageService.getItem("user");
};

export default useLoggedInUser;
