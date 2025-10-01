import { ROLES } from "constant";
import moment from "moment";
import { ToWords } from "to-words";
import { getMomentDate, isFutureDate, TODAY_DATE, TOMORROW } from "./convertDate";

export const isSettled = (status) => status === "Settled";

export const userCurrency = (currency) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	});

export const statusColor = (status) => {
	if (status?.includes("Overdue")) {
		return { color: "red", bg: generateLighterShade("#c1acac", 0.8) };
	} else if (status?.includes("Due Today")) {
		return { color: "green", bg: generateLighterShade("#b1c9b1", 0.8) };
	} else if (status?.includes("Upcoming")) {
		return { color: "blue", bg: generateLighterShade("#d1d2ef", 0.5) };
	} else {
		return { color: "#213622", bg: generateLighterShade("#213622", 0.8) };
	}
};

export const generateLighterShade = (color, factor) => {
	const hexToRgb = (hex) => {
		const bigint = parseInt(hex.slice(1), 16);
		return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
	};

	const rgbToHex = (rgb) => {
		return `#${rgb.map((value) => `0${value.toString(16)}`.slice(-2)).join("")}`;
	};

	const lightenColor = (color, factor) => {
		const [r, g, b] = hexToRgb(color);
		const adjustedColor = [
			Math.round(r + (255 - r) * factor),
			Math.round(g + (255 - g) * factor),
			Math.round(b + (255 - b) * factor),
		];
		return rgbToHex(adjustedColor);
	};

	return lightenColor(color, factor);
};

export const toCapitalize = (str) => str?.replace(/\b\w/g, (match) => match.toUpperCase());

export const generateRandomData = (name, count) => {
	const data = [];
	for (let i = 0; i < count; i++) {
		const value = Math.floor(Math.random() * 100) + 1;
		data.push({ name, value });
	}
	return data;
};
export const isValidPhoneNumber = (phoneNumber) => {
	const phoneRegex = /^[0-9]{10}$/;
	return phoneRegex.test(phoneNumber);
};

// const countClosedSubitems = (subitems) => {
// 	return subitems?.length > 0
// 		? subitems?.filter((subitem) => subitem.isOpen === false)?.length
// 		: 0;
// };

export const calculateTaskCompletion = (task) => {
	let totalTaskHours = 0;
	let completedTaskHours = 0;
	if (task?.activities?.length > 0) {
		for (const activity of task?.activities) {
			totalTaskHours += activity.timeToComplete;
			if (activity.isOpen === false) {
				completedTaskHours += activity.timeToComplete;
			}
		}
	}
	if (task?.subtasks?.length > 0) {
		for (const subtask of task?.subtasks) {
			// const { totalSubtaskHours, completedSubtaskHours } =
			// 	calculateSubtaskCompletion(subtask);
			// totalTaskHours += totalSubtaskHours;
			// completedTaskHours += completedSubtaskHours;
			totalTaskHours += subtask.timeToComplete;
			if (subtask.isOpen === false) {
				completedTaskHours += subtask.timeToComplete;
			}
		}
	}
	const completionPercentage = Math.floor(completedTaskHours / totalTaskHours) * 100 || 0;
	return { totalTaskHours, completedTaskHours, completionPercentage };
	// const totalSubTasks =
	// 	task?.subtasks?.length > 0 ? Object.keys(task?.subtasks)?.length : 0;
	// const totalActionItems =
	// 	task?.activities?.length > 0 ? Object.keys(task?.activities)?.length : 0;
	// const totalSubitems = totalSubTasks + totalActionItems;

	// const closedSubitems =
	// 	countClosedSubitems(task?.subtasks) + countClosedSubitems(task?.activities);

	// return totalSubitems > 0
	// 	? Math.floor((closedSubitems / totalSubitems) * 100)
	// 	: 0;
};

export const calculateProjectCompletion = (project) => {
	let totalHours = 0;
	let completedHours = 0;
	for (const task of project.tasks) {
		const { totalTaskHours, completedTaskHours } = calculateTaskCompletion(task);

		totalHours += totalTaskHours;
		completedHours += completedTaskHours;
	}
	const completionPercentage = Math.floor(completedHours / totalHours) * 100;

	// Update project status based on completion percentage
	// if (completionPercentage === 100) {
	// 	project.status = "Completed";
	// }

	project.completionPercentage = completionPercentage || 0;
	return project.completionPercentage;
	// const totalTasks = project.tasks.length;
	// const completedTasks = project.tasks.filter(
	// 	(task) => calculateTaskCompletion(task) === 100,
	// ).length;

	// return totalTasks > 0 ? Math.floor((completedTasks / totalTasks) * 100) : 0;
};

export const ALL_ROLES = [ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.ADMINISTRATOR, ROLES.ENROLLER];

export const COVER_COLORS = [
	"var(--product1)",
	"var(--product2)",
	"var(--product3)",
	"var(--product4)",
	"var(--product5)",
	"var(--product6)",
];

export const getRoleColor = (role) => {
	const colors = [
		{ title: ROLES.MANAGER, color: "var(--overtime)" },
		{ title: ROLES.EMPLOYEE, color: "var(--action_status_approve)" },
		{ title: ROLES.ADMINISTRATOR, color: "var(--primary_button_bg)" },
		{ title: ROLES.ENROLLER, color: "var(--product5)" },
		{ title: ROLES.AUTH_ADMINISTRATOR, color: "var(--nav_menu)" },
		{ title: "Tester Role", color: "var(--stat_item_color)" },
	];
	// const randomIndex = Math.floor(Math.random() * colors.length);

	return colors?.find(({ title }) => title === role)?.color;
};

export const isManager = (role) => role !== ROLES.EMPLOYEE && role !== ROLES.ENROLLER;
export const hasConsoleAccess = (role) => isManager(role) && role !== ROLES.MANAGER;

export const calcTotal = (data, param1, param2) => {
	return data.reduce((acc, product) => {
		return param2
			? acc + parseFloat(product[param1] * product[param2])
			: acc + parseFloat(product[param1]);
	}, 0);
};

export const styleConsole = (value) =>
	console.log(`%c ${value}`, "color:red;font-weight:bold;background-color:white");
// "34,456" to 34456
export const convertToNum = (str) => parseFloat(str.replace(/,/g, ""));

export const isPaygroup = (name) => name?.payrollActivated;

export const isExtraPay = (payPeriodNum, isExtra) => (isExtra ? `${payPeriodNum}E` : payPeriodNum);

export const getPayNum = (payNo, isExtra, payStubs) => {
	return isExtra
		? payStubs?.find(
				({ payPeriodNum, isExtraRun }) =>
					parseInt(payPeriodNum) === parseInt(payNo) && isExtraRun === isExtra,
		  )
		: payStubs?.find(({ payPeriodNum, isExtraRun }) => payPeriodNum === payNo && !isExtraRun);
};

export const sortRecordsByDate = (records, key, isDate = true, sort = true, frequency) => {
	const sortedList = sort
		? records?.sort((a, b) => (isDate ? new Date(a[key]) - new Date(b[key]) : a[key] - b[key]))
		: records;

	sortedList?.map((record) => {
		const { color, bg, name, isDisabledStatus, isViewAction, isDisabledAction } =
			getPayrollStatus(record);
		record.color = color;
		record.bg = bg;
		record.name = name;
		record.isDisabledStatus = isDisabledStatus;
		record.isViewAction = isViewAction;
		record.isDisabledAction = isDisabledAction;
		record.frequency = frequency;
		return record;
	});
	return sortedList;
};

export const getPayrollStatus = (data, prevRecordEndDate) => {
	const defaultStatus = {
		name: "Pending",
		color: "var(--calendar_border)",
		bg: generateLighterShade("#bbbbbb", 0.8),
		isDisabledStatus: true,
		isViewAction: false,
		isDisabledAction: true,
	};
	const targetStartDate = getMomentDate(data.payPeriodStartDate);
	const targetEndDate = getMomentDate(data?.payPeriodEndDate);
	const targetPayDate = getMomentDate(data?.payPeriodPayDate);
	const targetProcessingDate = getMomentDate(data?.payPeriodProcessingDate);

	const isEndDatePassed = targetEndDate.isBefore(TODAY_DATE, "day");
	const isPayDateInFuture = targetPayDate.isAfter(TODAY_DATE, "day");
	const isPayDateToday = targetPayDate.isSameOrBefore(TODAY_DATE, "day");
	const isDueToday = targetProcessingDate.isSame(TODAY_DATE, "day");
	const isDueTomorrow = targetProcessingDate.isSame(TOMORROW, "day");

	const isOverdue = isFutureDate(targetProcessingDate);

	if (!data?.isProcessed && isOverdue) {
		return {
			name: "Overdue",
			color: "var(--incorrect_ans)",
			bg: generateLighterShade("#f62f29", 0.8),
			isViewAction: false,
			isDisabledStatus: false,
		};
	} else if (!data?.isProcessed && isDueToday) {
		return {
			name: "Due Today",
			color: "var(--incorrect_ans)",
			bg: generateLighterShade("#a9201b", 0.8),
			isViewAction: false,
			isDisabledStatus: false,
			isDisabledAction: !isEndDatePassed,
		};
	} else if (!data?.isProcessed && isDueTomorrow) {
		return {
			name: "Due Tomorrow",
			color: "var(--incorrect_ans)",
			bg: generateLighterShade("#a9201b", 0.8),
			isViewAction: false,
			isDisabledStatus: false,
			isDisabledAction: !isEndDatePassed,
		};
	} else if (
		!data?.isProcessed &&
		(isEndDatePassed || moment.utc().isBetween(targetStartDate, targetEndDate, "day", "[]"))
	) {
		return {
			name: "In Progress",
			color: "var(--pending)",
			bg: generateLighterShade("#d68e67", 0.8),
			isDisabledStatus: false,
			isViewAction: false,
			isDisabledAction: !isEndDatePassed,
		};
	} else if (data?.isProcessed && isPayDateToday) {
		return {
			name: "Paid",
			color: "var(--action_status_approve)",
			bg: generateLighterShade("#498b8f", 0.8),
			isDisabledStatus: false,
			isViewAction: true,
		};
	} else if (data?.isProcessed && isPayDateInFuture) {
		return {
			name: "Submitted",
			color: "var(--action_status_approve)",
			bg: generateLighterShade("#498b8f", 0.8),
			isDisabledStatus: false,
			isViewAction: true,
		};
	}
	// else if (
	// 	data.isProcessed &&
	// 	targetEndDate.isSame(today.startOf("day"), "day")
	// ) {
	// 	return {
	// 		name: "Pending",
	// 		color: "var(--primary_bg)",
	// 		bg: "var(--pending)",
	// 		isDisabledStatus: true,
	// 		isViewAction: false,
	// 	};
	// }
	else {
		return defaultStatus;
	}
};

export const toWords = new ToWords({
	localeCode: "en-US",
	converterOptions: {
		currency: true, // Enable currency conversion
		ignoreZeroCurrency: false, // Do not ignore zero currency
		ignoreDecimal: false, // Do not ignore decimal part
		ignorePlural: false, // Do not ignore plural currency
		ordinal: false, // Do not convert to ordinal words
		currencyOptions: {
			name: "Dollar", // Name of the currency
			plural: "Dollars", // Plural form of the currency
			symbol: "$", // Symbol of the currency
			fractionalUnit: {
				name: "Cent", // Name of the fractional unit
				plural: "Cents", // Plural form of the fractional unit
				symbol: "", // Symbol of the fractional unit (empty for cents)
			},
		},
	},
});
