import { SIDEBAR_MENU } from "data";
import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const [permissionData, setPermissionData] = useState(SIDEBAR_MENU);

	return (
		<DataContext.Provider value={{ permissionData, setPermissionData }}>
			{children}
		</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);
