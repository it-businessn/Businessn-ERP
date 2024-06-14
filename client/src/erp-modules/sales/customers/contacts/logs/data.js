import { CiPercent } from "react-icons/ci";
import { FaMailBulk } from "react-icons/fa";
import { GiVideoCamera } from "react-icons/gi";
import { IoCall } from "react-icons/io5";
import { MdContactPage } from "react-icons/md";
import { TbMailForward, TbMailShare } from "react-icons/tb";
import { TiSocialLinkedin } from "react-icons/ti";

export const LOG_TYPES = [
	{
		name: "Email",
		value: "Email",
	},
	{
		name: "Call",
		value: "Call",
	},
	{
		name: "Mailing List",
		value: "Mailing List",
	},
	{
		name: "Meeting",
		value: "Meeting",
	},
	{
		name: "LinkedIn Contact",
		value: "LinkedIn Contact",
	},
	{
		name: "LinkedIn Message",
		value: "LinkedIn Message",
	},
	{
		name: "Sale",
		value: "Sale",
	},
	{
		name: "Contract",
		value: "Contract",
	},
];

export const ACTIVITY_CARDS = [
	{
		color: "var(--status_button_border_",
		icon: TbMailForward,
		title: "Emails sent",
		count: 0,
		action: "Log new email",
		label: "Emails",
		target: 60,
		value: "Email",
	},
	{
		color: "var(--status_button_border)",
		icon: FaMailBulk,
		title: "Mailing list emails added",
		count: 0,
		action: "Log new mailing list email",
		label: "Mailing list",
		target: 1,
		value: "Mailing List",
	},
	{
		color: "purple",
		icon: IoCall,
		title: "Phone calls made",
		count: 0,
		action: "Log new call",
		label: "Calls",
		target: 60,
		value: "Call",
	},
	{
		color: "var(--primary_button_bg)",
		icon: GiVideoCamera,
		title: "Meetings",
		count: 0,
		action: "Log new meeting",
		label: "Meetings",
		target: 1,
		value: "Meeting",
	},
	{
		color: "var(--primary_button_bg)",
		icon: TiSocialLinkedin,
		title: "Linked in friends added",
		count: 0,
		action: "Log new linkedIn contact",
		label: "Contacts",
		target: 5,
		value: "LinkedIn Contact",
	},
	{
		color: "var(--primary_button_bg)",
		icon: TbMailShare,
		title: "Linked in messages sent",
		count: 0,
		action: "Log new linkedIn message",
		label: "Messages",
		target: 2,
		value: "LinkedIn Message",
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
		target: 2,
		value: "Sale",
	},
	{
		color: "var(--status_button_border)",
		icon: MdContactPage,
		title: "New Contracts Added",
		count: 0,
		action: "Log new contract",
		label: "Contracts",
		target: 2,
		value: "Contract",
	},
];
