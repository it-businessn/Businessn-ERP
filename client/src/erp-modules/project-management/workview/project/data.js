import badge1 from "../../../../assets/badge1.jpg";
// import badge2 from "../../../../assets/badge2.jpg";
// import badge3 from "../../../../assets/badge3.jpg";

export const COLORS = {
	primary: "#537eee",
	task_status: "#76c094",
};

export const BADGES = [badge1, badge1, badge1];

export const RANDOM_PEOPLE_ICON = [
	{
		url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-var(--main_color)-blank-wall_273609-17092.jpg?size=626&ext=jpg&ga=GA1.1.846607490.1709792202&semt=sph",
	},
	{
		url: "https://img.freepik.com/free-photo/happiness-wellbeing-confidence-concept-cheerful-attractive-african-american-woman-curly-haircut-cross-arms-chest-self-assured-powerful-pose-smiling-determined-wear-yellow-sweater_176420-35063.jpg?size=626&ext=jpg&ga=GA1.1.846607490.1709792202&semt=sph",
	},
	{
		url: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?size=626&ext=jpg&ga=GA1.1.846607490.1709792202&semt=sph",
	},
	{
		url: "https://img.freepik.com/free-photo/young-beautiful-woman-looking-camera-trendy-girl-casual-summer-var(--main_color)-t-shirt-jeans-shorts-positive-female-shows-facial-emotions-funny-model-isolated-yellow_158538-15796.jpg?size=626&ext=jpg&ga=GA1.1.846607490.1709792202&semt=sph",
	},
	{
		url: "https://img.freepik.com/free-photo/lifestyle-beauty-fashion-people-emotions-concept-young-asian-female-office-manager-ceo-with-pleased-expression-standing-var(--main_color)-background-smiling-with-arms-crossed-chest_1258-59329.jpg?size=626&ext=jpg&ga=GA1.1.846607490.1709792202&semt=sph",
	},
	{
		url: "https://img.freepik.com/premium-psd/man-black-sweater-stands-front-picture-man_176841-36947.jpg?size=626&ext=jpg&ga=GA1.1.846607490.1709792202&semt=sph",
	},
	{
		url: "https://img.freepik.com/free-photo/latin-man-smiling-cheerful-expression-closeup-portrait_53876-128963.jpg?size=626&ext=jpg&ga=GA1.1.846607490.1709792202&semt=sph",
	},
	{
		url: "https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-var(--main_color)-wall-self-confident-man-freelancer_273609-16320.jpg?size=626&ext=jpg&ga=GA1.1.846607490.1709792202&semt=sph",
	},
	{
		url: "https://img.freepik.com/free-photo/portrait-smart-professional-african-american-man-standing-with-hands-crossed-chest-confident-pose_176420-33861.jpg?size=626&ext=jpg&ga=GA1.1.846607490.1709792202&semt=sph",
	},
];

export const PRIORITY = ["High", "Medium", "Low"];

export const workView_Table = {
	projects_cols: [
		"Project name",
		"Assignee(s)",
		"Priority",
		"Start Date",
		"Due Date",
		"Manager",
		"Last Updated",
		"Status",
	],
	task_cols: [
		"Task name",
		"Assignee(s)",
		"Priority",
		"Last Updated",
		"Due Date",
		"Status",
	],
	task_view_cols: [
		"Task name",
		"Assignee(s)",
		"Priority",
		"Project",
		"Last Updated",
		"Due Date",
		"Status",
	],
};

export const PROJECT_ASSIGNEES = [
	{ name: "Assignee 1", id: "Assignee1" },
	{ name: "Assignee 2", id: "Assignee2" },
];

export const SUPERVISOR_ASSIGNEES = [
	{ name: "Supervisor 1", id: "Supervisor1" },
	{ name: "Supervisor 2", id: "Supervisor2" },
];

export const REGIONS = [
	{ name: "British Columbia", id: "BC" },
	{ name: "Manitoba", id: "MB" },
	{ name: "Alberta", id: "AB" },
];

export const DISBURSE_MODE_OPTIONS = [
	{ id: "round-robin", name: "Geographic Round Robin" },
	{ id: "manual", name: "Manual Assignment" },
	{ id: "weighted", name: "Weighted Distribution" },
];

export const PRODUCTS_SERVICES = [
	{ name: "Software", id: "software" },
	{ name: "Hardware", id: "hardware" },
	{ name: "Consulting", id: "consulting" },
];

export const INDUSTRIES = [
	{ name: "Technology", id: "technology" },
	{ name: "Healthcare", id: "healthcare" },
	{ name: "Finance", id: "finance" },
	{ name: "Manufacturing", id: "manufacturing" },
	{ name: "Education", id: "education" },
];

export const LEAD_SOURCES = [
	{ name: "Referral", id: "referral" },
	{ name: "Cold Call", id: "cold-call" },
	{ name: "Website Inquiry", id: "website-inquiry" },
	{ name: "Trade Show", id: "trade-show" },
	{ name: "Social Media", id: "social-media" },
];

export const WEIGHTING = [
	{ name: "0", id: "0" },
	{ name: "1", id: "1" },
	{ name: "2", id: "2" },
	{ name: "3", id: "3" },
	{ name: "4", id: "4" },
	{ name: "5", id: "5" },
	{ name: "6", id: "6" },
	{ name: "7", id: "7" },
	{ name: "8", id: "8" },
	{ name: "9", id: "9" },
	{ name: "10", id: "10" },
];

export const AREAS = [
	{ name: "Surrey", id: "Surrey" },
	{ name: "Cloverdale", id: "Cloverdale" },
	{ name: "Whalley", id: "" },
];

export const VIEW_MODE = [
	{ name: "Projects", id: "Projects" },
	// { name: "Tasks", id: "Tasks" },
	// { name: "Activities", id: "Activities" },
];
