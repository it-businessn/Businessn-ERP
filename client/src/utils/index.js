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
		return `#${rgb
			.map((value) => `0${value.toString(16)}`.slice(-2))
			.join("")}`;
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

export const toCapitalize = (str) =>
	str?.replace(/\b\w/g, (match) => match.toUpperCase());

export const formatDate = (date) =>
	new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

export const formatDateTime = (date) =>
	`${formatDate(date)} ${new Date(date).toLocaleTimeString()}`;

export const generateRandomData = (name, count) => {
	const data = [];
	for (let i = 0; i < count; i++) {
		const value = Math.floor(Math.random() * 100) + 1;
		data.push({ name, value });
	}
	return data;
};

export function getDefaultDate(isoDate) {
	const dateObject = new Date(isoDate);
	return dateObject.toISOString().split("T")[0];
}

export function getDefaultTime(date) {
	return moment(date, "HH:mm").format("hh:mm A");
}

export function getDateDiffHours(date1, date2) {
	const hoursDiff = moment(date2).diff(moment(date1), "hours");
	const minutesDiff = moment(date2).diff(moment(date1), "minutes") % 60;

	const formattedHours = String(hoursDiff).padStart(2, "0");
	const formattedMinutes = String(minutesDiff).padStart(2, "0");

	return `${formattedHours}:${formattedMinutes}`;
	// return `${moment(date2).diff(moment(date1), "hours")}.${moment(date2).diff(
	// 	moment(date1),
	// 	"minutes",
	// )}`;
}

export const isValidPhoneNumber = (phoneNumber) => {
	const phoneRegex = /^[0-9]{10}$/;
	return phoneRegex.test(phoneNumber);
};

export const CircularFillProgress = ({ completionPercentage }) => {
	completionPercentage = 95;
	const rotation = completionPercentage * 3.6;
	const fillColorClass =
		completionPercentage === 100 ? "fill-complete" : "fill";
	const clipLeft =
		completionPercentage <= 50 ? 0 : 100 - completionPercentage * 2;
	const clipRight = completionPercentage >= 50 ? 100 : 100 - clipLeft;

	const color =
		completionPercentage >= 95
			? "var(--lead_cards_bg)"
			: "var(--main_color_black)";
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

export const CircularProgressBarCell = ({ completionPercentage, size }) => {
	return (
		<CircularProgress
			size={size}
			value={completionPercentage}
			color={getProgressColor(completionPercentage)}
		>
			<CircularProgressLabel>{`${completionPercentage}%`}</CircularProgressLabel>
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
	const completionPercentage =
		Math.floor(completedTaskHours / totalTaskHours) * 100 || 0;
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
		const { totalTaskHours, completedTaskHours } =
			calculateTaskCompletion(task);

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
			color={"brand.primary_button_bg"}
			border={`1px solid ${generateLighterShade(COLORS.primary, 0.5)}`}
			bg={generateLighterShade(COLORS.primary, 0.8)}
			leftIcon={
				<Icon as={GoTasklist} sx={{ marginRight: "-4px", fontsize: "10px" }} />
			}
			rightIcon={
				<Icon
					as={isExpanded ? FaChevronUp : FaChevronDown}
					sx={{ marginLeft: "-4px", fontsize: "10px" }}
				/>
			}
			_hover={{
				bg: generateLighterShade(COLORS.primary, 0.8),
				color: "brand.primary_button_bg",
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
								color: "brand.nav_color",
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
							color="brand.nav_color"
							_hover={{
								bg: generateLighterShade(COLORS.primary, 0.8),
								color: "brand.nav_color",
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
					color="brand.nav_color"
					_hover={{
						bg: generateLighterShade(COLORS.primary, 0.8),
						color: "brand.nav_color",
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
		bars.push(
			<Box key={i} h="2em" w="10px" bgColor={barColor} borderRadius="2px" />,
		);
	}

	return bars;
};

export const customOrder = [
	ROLES.PM,
	ROLES.ASSOCIATE,
	ROLES.TECH_ADMIN,
	ROLES.ADMIN,
];

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
		{ title: ROLES.PM, color: "var(--stat_item_color)" },
		{ title: ROLES.ASSOCIATE, color: "var(--correct_ans)" },
		{ title: ROLES.TECH_ADMIN, color: "var(--primary_button_bg)" },
		{ title: ROLES.ADMIN, color: "var(--event_color)" },
		{ title: ROLES.OTHERS, color: "var(--gray2_color)" },
	];
	// const randomIndex = Math.floor(Math.random() * colors.length);

	return colors?.find(({ title }) => title === role)?.color;
};

export const isManager = (role) =>
	role?.includes(ROLES.ADMIN) ||
	// role?.includes(ROLES.MANAGER) ||
	role?.includes(ROLES.TECH_ADMIN);

export const timeSpan = (time) => {
	const givenTime = new Date(time);
	const currentTime = new Date();

	const differenceMs = currentTime - givenTime;
	const hoursAgo = Math.floor(differenceMs / (1000 * 60 * 60));
	const minutesAgo = Math.floor(
		(differenceMs % (1000 * 60 * 60)) / (1000 * 60),
	);
	return `${hoursAgo}hr ${minutesAgo}m ago`;
};

export const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getTimezone = (date) =>
	moment.tz(date, "America/Chicago").clone().tz(userTimezone).format();
