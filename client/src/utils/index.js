import {
	Box,
	Button,
	CircularProgress,
	CircularProgressLabel,
	Icon,
} from "@chakra-ui/react";
import { COLORS } from "erp-modules/project-management/workview/data";
import { FaCaretDown } from "react-icons/fa";
import { GoTasklist } from "react-icons/go";

export const userCurrency = (currency) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	});

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
	str.replace(/\b\w/g, (match) => match.toUpperCase());

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

export const isValidPhoneNumber = (phoneNumber) => {
	const phoneRegex = /^[0-9]{10}$/;
	return phoneRegex.test(phoneNumber);
};

export const CircularFillProgress = ({ completionPercentage }) => {
	const rotation = completionPercentage * 3.6;
	return (
		<Box position="relative" width="100px" height="100px">
			<div className="radial-progress">
				<div className="circle">
					<div
						className="mask"
						style={{ transform: `rotate(${rotation}deg)` }}
					/>
					<div className="fill" />
				</div>
				<div className="label">{`${completionPercentage}%`}</div>
			</div>
		</Box>
	);
};

export const CircularProgressBarCell = ({ completionPercentage }) => {
	return (
		<CircularProgress
			value={completionPercentage}
			color={
				completionPercentage >= 75 ? "green.400" : "brand.primary_button_bg"
			}
		>
			<CircularProgressLabel>{`${completionPercentage}%`}</CircularProgressLabel>
		</CircularProgress>
	);
};

export const TaskButton = ({ totalTasks, onClick }) => {
	return (
		<Button
			onClick={onClick}
			size="xxs"
			display={"flex"}
			p={"2px"}
			fontSize={"8px"}
			color={"brand.primary_button_bg"}
			border={`1px solid ${generateLighterShade(COLORS.primary, 0.5)}`}
			bg={generateLighterShade(COLORS.primary, 0.8)}
			leftIcon={
				<Icon as={GoTasklist} sx={{ marginRight: "-4px", fontsize: "10px" }} />
			}
			rightIcon={
				<Icon as={FaCaretDown} sx={{ marginLeft: "-4px", fontsize: "10px" }} />
			}
			_hover={{
				bg: generateLighterShade(COLORS.primary, 0.8),
				color: "brand.primary_button_bg",
			}}
		>
			{totalTasks}
		</Button>
	);
};

export const renderPriorityBars = (priority) => {
	const barCount = 3;
	const bars = [];

	for (let i = 0; i < barCount; i++) {
		const barColor =
			priority <= (i + 1) * 33.33 ? "brand.priority_medium" : "orange.400";
		bars.push(
			<Box key={i} h="2em" w="10px" bgColor={barColor} borderRadius="2px" />,
		);
	}

	return bars;
};
