import { EditIcon, EmailIcon } from "@chakra-ui/icons";
import { BsCalendar3, BsChatTextFill, BsListTask } from "react-icons/bs";
import { CiPercent } from "react-icons/ci";
import {
	FaAddressBook,
	FaDashcube,
	FaRProject,
	FaSalesforce,
} from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { GiVideoCamera } from "react-icons/gi";
import { HiOutlineCalendar } from "react-icons/hi";
import { IoMdCall } from "react-icons/io";
import {
	IoBagRemoveOutline,
	IoCall,
	IoDocumentTextOutline,
} from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import {
	MdCall,
	MdCleanHands,
	MdContactPage,
	MdOutlineEventNote,
	MdOutlineSettingsApplications,
	MdPayments,
} from "react-icons/md";
import { PiBooks, PiListMagnifyingGlassFill } from "react-icons/pi";
import {
	RiAspectRatioLine,
	RiUserSearchLine,
	RiUserStarLine,
} from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import {
	TbChartDots,
	TbFileInvoice,
	TbShoppingBag,
	TbUsersPlus,
} from "react-icons/tb";

export const TOAST = {
	SUCCESS: {
		title: "Data Updated Successfully",
		status: "success",
		isClosable: true,
	},
	ERROR: {
		title: "Sorry! Please try again.",
		status: "error",
		isClosable: true,
	},
};

export const ACTIVITY_CARDS = [
	{
		color: "#ed6175",
		icon: CiPercent,
		title: "Pending Sales",
		count: 2000,
		action: "Add New Emails",
	},
	{
		color: "#62ad84",
		icon: MdContactPage,
		title: "New Contracts Added",
		count: 2000,
		action: "Add New Contracts",
	},
	{
		color: "purple",
		icon: IoCall,
		title: "Phone Calls Made",
		count: 2000,
		action: "Add New Calls",
	},
	{
		color: "grey",
		icon: GiVideoCamera,
		title: "Meetings",
		count: 2000,
		action: "Add New Meetings",
	},
	{
		color: "grey",
		icon: RiAspectRatioLine,
		title: "Sales Target",
		count: 2000,
		action: "Add New Target",
	},
];

export const callsMadeBarData = [
	{ day: "Mon", call: 10 },
	{ day: "Tue", call: 15 },
	{ day: "Wed", call: 20 },
	{ day: "Thu", call: 25 },
	{ day: "Fri", call: 18 },
	{ day: "Sat", call: 12 },
	{ day: "Sun", call: 8 },
];

const callsBarData = {
	labels: callsMadeBarData.map((item) => item.day),
	datasets: [
		{
			label: "Calls Made",
			data: callsMadeBarData.map((item) => item.call),
			backgroundColor: "#5580f1",
			borderRadius: 12,
			fill: false,
		},
	],
};
const emailsBarData = {
	labels: callsMadeBarData.map((item) => item.day),
	datasets: [
		{
			label: "Emails Sent",
			data: callsMadeBarData.map((item) => item.call),
			backgroundColor: "#61a9c1",
			borderRadius: 12,
		},
	],
};

export const BAR_DATA = [
	{
		title: "Calls Made",
		data: callsBarData,
	},
	{
		title: "Emails Sent",
		data: emailsBarData,
	},
];

export const doughnutOptions = (cutout) => ({
	cutout,
	plugins: {
		datalabels: {
			display: true,
		},
		legend: {
			align: "center",
			position: "bottom",
		},
	},
});
export const barOptions = {
	plugins: {
		legend: {
			align: "center",
			position: "bottom",
		},
	},
};

export const FORM_FIELD = {
	TEXT: "textField",
	SELECT: "select",
	DATE: "date",
	COUNTRY: "country",
	STATE: "state",
	CITY: "city",
	LINK: "link",
};

export const PIPELINE_STAGES = [
	{
		type: "New",
		color: "#64a7dc",
		name: "New",
	},
	{
		type: "Presentation",
		color: "#fdb206",
		name: "Presentation",
	},
	{
		type: "Meeting",
		color: "#fa005a",
		name: "Meeting",
	},
	{
		type: "Negotiating",
		color: "#f88c00",
		name: "Negotiating",
	},
	{
		type: "Won",
		color: "#69cb36",
		name: "Won",
	},
];

export const leaderBoardData = [
	{
		position: 1,
		id: 2223,
		salesperson: "John Doe",
		category: "Electronics",
		calls: 150,
		value: 120,
		profilePic: "url-to-profile-pic-1",
		icon: IoMdCall,
	},
	{
		position: 2,
		id: 4544,
		salesperson: "Jane Smith",
		category: "Clothing",
		calls: 120,
		value: 100,
		profilePic: "url-to-profile-pic-1",
		icon: EmailIcon,
	},
	{
		position: 3,
		id: 4534,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FiTarget,
	},
	{
		position: 4,
		id: 6767,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FaSalesforce,
	},
	{
		position: 1,
		id: 2223,
		salesperson: "John Doe",
		category: "Electronics",
		calls: 150,
		value: 120,
		profilePic: "url-to-profile-pic-1",
		icon: IoMdCall,
	},
	{
		position: 2,
		id: 4544,
		salesperson: "Jane Smith",
		category: "Clothing",
		calls: 120,
		value: 100,
		profilePic: "url-to-profile-pic-1",
		icon: EmailIcon,
	},
	{
		position: 3,
		id: 4534,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FiTarget,
	},
	{
		position: 4,
		id: 6767,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FaSalesforce,
	},
	{
		position: 1,
		id: 2223,
		salesperson: "John Doe",
		category: "Electronics",
		calls: 150,
		value: 120,
		profilePic: "url-to-profile-pic-1",
		icon: IoMdCall,
	},
	{
		position: 2,
		id: 4544,
		salesperson: "Jane Smith",
		category: "Clothing",
		calls: 120,
		value: 100,
		profilePic: "url-to-profile-pic-1",
		icon: EmailIcon,
	},
	{
		position: 3,
		id: 4534,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FiTarget,
	},
	{
		position: 4,
		id: 6767,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FaSalesforce,
	},
];

export const upcomingTask = [
	{ icon: <MdOutlineEventNote />, title: "4 Tasks", color: "#3498db" },
	{ icon: <BsListTask />, title: "6 Events", color: "#2ecc71" },
	{ icon: <BsChatTextFill />, title: "2 Meetings", color: "#008080" },
	{ icon: <MdCall />, title: "2 Appointments", color: "#008080" },
];

export const activityChartData = {
	labels: ["Calls-75%", "Emails-25%", "Meetings-10%"],
	datasets: [
		{
			data: [65, 25, 10],
			backgroundColor: ["#517ae8", "#67afc8", "#8aa8ee"],
			hoverBackgroundColor: ["#517ae8", "#67afc8", "#8aa8ee"],
		},
	],
};

export const trainingChartData = {
	labels: ["Completed", "Ongoing"],
	datasets: [
		{
			data: [65, 10],
			backgroundColor: ["#517ae8", "#8aa8ee"],
			hoverBackgroundColor: ["#517ae8", "#8aa8ee"],
		},
	],
};

export const activityData = [
	{ angle: 65, label: "Calls", color: "#3498db" },
	{ angle: 25, label: "Emails", color: "#2ecc71" },
	{ angle: 10, label: "Meetings Done", color: "#008080" },
];

export const meetingsData = [
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2023",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2023",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2023",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2023",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
];
