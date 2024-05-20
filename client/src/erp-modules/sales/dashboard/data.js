import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaAward } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import { TfiTarget } from "react-icons/tfi";

export const HEADER_CARDS = [
	{
		color: "#cda4a8",
		icon: TfiTarget,
		title: "New Opportunities",
		subIcon: TfiTarget,
		value: 0,
		percent: "10%",
	},
	{
		color: "#9fd4d0",
		icon: FaAward,
		title: "No. of opportunities in the pipeline",
		subIcon: ArrowDownIcon,
		value: 0,
		percent: "2.22%",
	},
	{
		color: "#a5a4e0",
		icon: GiDiamondTrophy,
		title: "Value of opportunities in the pipeline",
		subIcon: ArrowUpIcon,
		value: "$0",
		percent: "3.34%",
	},
	{
		color: "#e0bb6c",
		icon: HiOutlineReceiptPercent,
		title: "Total Sales",
		subIcon: ArrowUpIcon,
		value: "0",
		percent: "1.22%",
	},
];
