import { EmailIcon } from "@chakra-ui/icons";
import { BsChatTextFill, BsListTask } from "react-icons/bs";
import { CiPercent } from "react-icons/ci";
import { FaMailBulk, FaSalesforce } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { GiVideoCamera } from "react-icons/gi";
import { IoMdCall } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { MdCall, MdContactPage, MdOutlineEventNote } from "react-icons/md";
import { TbMailForward, TbMailShare } from "react-icons/tb";
import { TiSocialLinkedin } from "react-icons/ti";

export const ROLES = {
	PM: "Project Manager",
	ASSOCIATE: "Sales Associate",
	TECH_ADMIN: "Technical Administrator",
	ADMIN: "Administrators",
	MANAGER: "Manager",
	OTHERS: "Tax Specialist",
};

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
		color: "var(--status_button_border_",
		icon: TbMailForward,
		title: "Emails sent",
		count: 0,
		action: "Log new email",
		label: "Emails",
	},
	{
		color: "var(--status_button_border)",
		icon: FaMailBulk,
		title: "Mailing list emails added",
		count: 0,
		action: "Log new mailing list email",
		label: "Mailing list",
	},
	{
		color: "purple",
		icon: IoCall,
		title: "Phone calls made",
		count: 0,
		action: "Log new call",
		label: "Calls",
	},
	{
		color: "var(--primary_button_bg)",
		icon: GiVideoCamera,
		title: "Meetings",
		count: 0,
		action: "Log new meeting",
		label: "Meetings",
	},
	{
		color: "var(--primary_button_bg)",
		icon: TiSocialLinkedin,
		title: "Linked in friends added",
		count: 0,
		action: "Log new linkedIn contact",
		label: "Contacts",
	},
	{
		color: "var(--primary_button_bg)",
		icon: TbMailShare,
		title: "Linked in messages sent",
		count: 0,
		action: "Log new linkedIn message",
		label: "Messages",
	},
];

export const SALES_ACTIVITY_CARDS = [
	{
		color: "var(--almost_pass)",
		icon: CiPercent,
		title: "Pending Sales",
		count: 0,
		action: "Log new sale",
		label: "Sales",
	},
	{
		color: "var(--status_button_border)",
		icon: MdContactPage,
		title: "New Contracts Added",
		count: 0,
		action: "Log new contract",
		label: "Contracts",
	},
];

export const callsMadeBarData = [
	{ day: "Mon", call: 0 },
	{ day: "Tue", call: 0 },
	{ day: "Wed", call: 0 },
	{ day: "Thu", call: 0 },
	{ day: "Fri", call: 0 },
	{ day: "Sat", call: 0 },
	{ day: "Sun", call: 0 },
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
		link: "new call",
	},
	{
		title: "Emails Sent",
		data: emailsBarData,
		link: "new email",
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
			position: "right",
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

export const activityData = [
	{ angle: 65, label: "Calls", color: "#3498db" },
	{ angle: 25, label: "Emails", color: "#2ecc71" },
	{ angle: 10, label: "Meetings Done", color: "#008080" },
];

export const meetingsData = [
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2024",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2024",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2024",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2024",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
];
