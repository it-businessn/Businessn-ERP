const LocalStorageService = {
	setItem: (key, value) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error("Error setting localStorage item:", error);
		}
	},

	getItem: (key) => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : null;
		} catch (error) {
			console.error("Error getting localStorage item:", error);
			return null;
		}
	},

	removeItem: (key) => {
		try {
			localStorage.removeItem(key);
			return null;
		} catch (error) {
			console.error("Error removing localStorage item:", error);
			return null;
		}
	},

	clear: () => localStorage.clear(),
};

export default LocalStorageService;
