import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	CircularProgress,
	CircularProgressLabel,
	HStack,
	Icon,
} from "@chakra-ui/react";
import { ROLES } from "constant";
import AddNotes from "erp-modules/project-management/workview/project/cell/AddNotes";
import { COLORS } from "erp-modules/project-management/workview/project/data";
import moment from "moment";
import { useState } from "react";
import { CgNotes } from "react-icons/cg";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GoTasklist } from "react-icons/go";
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

export const CircularFillProgress = ({ completionPercentage }) => {
	completionPercentage = 95;
	const rotation = completionPercentage * 3.6;
	const fillColorClass = completionPercentage === 100 ? "fill-complete" : "fill";
	const clipLeft = completionPercentage <= 50 ? 0 : 100 - completionPercentage * 2;
	const clipRight = completionPercentage >= 50 ? 100 : 100 - clipLeft;

	const color = completionPercentage >= 95 ? "var(--lead_cards_bg)" : "var(--main_color_black)";
	return (
		<Box position="relative" width="100px" height="100px">
			<div className="radial-progress">
				<div className="circle">
					<div
						className="mask"
						style={{
							clip: `rect(0px, ${clipRight}px, 100px, ${clipLeft}px)`,
							transform: `rotate(${rotation}deg)`,
						}}
					/>
					<div className={fillColorClass} />
				</div>
				<div
					className="label"
					style={{
						color,
					}}
				>{`${completionPercentage}%`}</div>
			</div>
		</Box>
	);
};

const getProgressColor = (value) =>
	value <= 0
		? "#edebe9"
		: value > 0 && value <= 14
		? "rgb(228 46 43)"
		: value > 14 && value <= 29
		? "rgb(254 100 53)"
		: value > 29 && value <= 44
		? "rgb(255 146 50)"
		: value > 44 && value <= 59
		? "rgb(252 190 56)"
		: value > 59 && value <= 74
		? "rgb(196 226 49)"
		: value > 74 && value <= 89
		? "rgb(110 205 25)"
		: value > 89 && value <= 99
		? "rgb(22 179 83)"
		: "rgb(3 150 151)";

export const CircularProgressBarCell = ({ completionPercentage, size, color, top }) => {
	return (
		<CircularProgress
			size={size}
			value={completionPercentage}
			color={color || getProgressColor(completionPercentage)}
		>
			<CircularProgressLabel top={top}>{`${completionPercentage}%`}</CircularProgressLabel>
		</CircularProgress>
	);
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

export const TaskButton = ({ totalTasks, onClick, isTask, isExpanded }) => {
	return (
		<Button
			onClick={onClick}
			size="xxs"
			display={"flex"}
			p={"2px"}
			fontSize={"12px"}
			color={"var(--primary_button_bg)"}
			border={`1px solid ${generateLighterShade(COLORS.primary, 0.5)}`}
			bg={generateLighterShade(COLORS.primary, 0.8)}
			leftIcon={<Icon as={GoTasklist} sx={{ marginRight: "-4px", fontsize: "10px" }} />}
			rightIcon={
				<Icon
					as={isExpanded ? FaChevronUp : FaChevronDown}
					sx={{ marginLeft: "-4px", fontsize: "10px" }}
				/>
			}
			_hover={{
				bg: generateLighterShade(COLORS.primary, 0.8),
				color: "var(--primary_button_bg)",
			}}
		>
			{`${totalTasks} T`}
		</Button>
	);
};

export const AddTaskButton = ({
	onClick,
	isTask,
	handleClick,
	isInner,
	data,
	type,
	setRefresh,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<HStack spacing={1}>
				{!isInner && (
					<>
						<Button
							onClick={onClick}
							size="xxs"
							display={"flex"}
							variant="solid"
							p={"3px"}
							bg="var(--lead_cards_bg)"
							fontWeight={"bold"}
							color="var(--primary_button_bg)"
							border={`1px solid ${generateLighterShade(COLORS.primary, 0.5)}`}
							_hover={{
								bg: generateLighterShade(COLORS.primary, 0.8),
								color: "var(--nav_color)",
							}}
						>
							<AddIcon />
						</Button>
						<Button
							onClick={() => setIsOpen(true)}
							size="xxs"
							display={"flex"}
							variant="ghost"
							fontWeight={"bold"}
							color="var(--nav_color)"
							_hover={{
								bg: generateLighterShade(COLORS.primary, 0.8),
								color: "var(--nav_color)",
							}}
						>
							<CgNotes />
						</Button>
					</>
				)}

				<Button
					onClick={handleClick}
					size="xxs"
					display={"flex"}
					variant="ghost"
					fontWeight={"bold"}
					color="var(--nav_color)"
					_hover={{
						bg: generateLighterShade(COLORS.primary, 0.8),
						color: "var(--nav_color)",
					}}
				>
					<SettingsIcon />
				</Button>
			</HStack>
			{isOpen && (
				<AddNotes
					type={type}
					data={data}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					setRefresh={setRefresh}
				/>
			)}
		</>
	);
};

export const renderPriorityBars = (priority) => {
	const barCount = 3;
	const bars = [];

	for (let i = 0; i < barCount; i++) {
		const barColor =
			priority.toLowerCase() === "high"
				? "rgb(228 45 46)"
				: priority.toLowerCase() === "medium"
				? "orange.400"
				: "rgb(222 222 222)";
		bars.push(<Box key={i} h="2em" w="10px" bgColor={barColor} borderRadius="2px" />);
	}

	return bars;
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
