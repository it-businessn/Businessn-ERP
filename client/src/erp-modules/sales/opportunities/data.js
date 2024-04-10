export const LEAD_STAGES = [
	{ abbr: "L1", name: "Fresh Leads", id: "L1", color: "#dbe5ff" },
	{ abbr: "L2", name: "Contacted", id: "L2", color: "#c4f7d8" },
	{ abbr: "L3", name: "Call Back", id: "L3", color: "#caeaf5" },
	{ abbr: "L4", name: "Do Not Call", id: "L4", color: "#ffe4e1" },
	{ abbr: "T1", name: "Meeting Set", id: "T1", color: "#dbe5ff" },
	{ abbr: "T2", name: "Discovery Call", id: "T2", color: "#c4f7d8" },
	{ abbr: "T3", name: "Closing", id: "T3", color: "#caeaf5" },
	{ abbr: "T4", name: "Onboard", id: "T4", color: "#ffe4e1" },
];

export const FRESH_LEADS = LEAD_STAGES.slice(0, 4);

export const TARGET_LEADS = LEAD_STAGES.slice(-4);
