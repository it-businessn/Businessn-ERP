import { COLS, CONTRIBUTION } from "constant";

export const REGULAR_ER_COLS = [
	{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
	// {
	// 	key: `${CONTRIBUTION.EI} (ER)`,
	// 	pair: "EI",
	// 	align: "center",
	// 	round: true,
	// },
	// {
	// 	key: `${CONTRIBUTION.CPP} (ER)`,
	// 	pair: "CPP",
	// 	align: "center",
	// 	round: true,
	// },
	{
		key: `ER ${CONTRIBUTION.PENSION_PLAN}`,
		pair: "EPP",
		round: true,
		align: "center",
	},
	{
		key: `ER ${CONTRIBUTION.HEALTH_PLAN}`,
		pair: "EHP",
		align: "center",
		round: true,
	},
	{
		key: "er1",
	},
	{
		key: "er2",
	},
	{
		key: "er3",
	},
	{
		key: "er41",
	},
	{
		key: "er5",
	},
	{
		key: "er6",
	},
	{
		key: "er7",
	},
	{
		key: "er8",
	},
	{
		key: "er9",
	},
	{
		key: "er10",
	},
	{
		key: "er11",
	},
];

export const PAYOUT_ER_COLS = [
	{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
	// {
	// 	key: `${CONTRIBUTION.EI} (ER)`,
	// 	pair: "EI",
	// 	align: "center",
	// 	round: true,
	// },
	// {
	// 	key: `${CONTRIBUTION.CPP} (ER)`,
	// 	pair: "CPP",
	// 	align: "center",
	// 	round: true,
	// },
	{
		key: `ER ${CONTRIBUTION.PENSION_PLAN}`,
		pair: "EPP",
		round: true,
		align: "center",
	},
	{
		key: `ER ${CONTRIBUTION.HEALTH_PLAN}`,
		pair: "EHP",
		align: "center",
		round: true,
	},
	{
		key: "er31",
	},
	{
		key: "er4",
	},
	{
		key: "er33",
	},
	{
		key: "er42",
	},
	{
		key: "er51",
	},
	{
		key: "er61",
	},
	{
		key: "er71",
	},
	{
		key: "er81",
	},
	{
		key: "er91",
	},
	{
		key: "er102",
	},
	{
		key: "er121",
	},
];

export const MANUAL_ER_COLS = [
	{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
	// {
	// 	key: `${CONTRIBUTION.EI} (ER)`,
	// 	pair: "EI",
	// 	align: "center",
	// 	round: true,
	// },
	// {
	// 	key: `${CONTRIBUTION.CPP} (ER)`,
	// 	pair: "CPP",
	// 	align: "center",
	// 	round: true,
	// },
	{
		key: `ER ${CONTRIBUTION.PENSION_PLAN}`,
		pair: "EPP",
		round: true,
		align: "center",
	},
	{
		key: `ER ${CONTRIBUTION.HEALTH_PLAN}`,
		pair: "EHP",
		align: "center",
		round: true,
	},
	{
		key: "er32",
	},
	{
		key: "er43",
	},
	{
		key: "er34",
	},
	{
		key: "er44",
	},
	{
		key: "er52",
	},
	{
		key: "er62",
	},
	{
		key: "er72",
	},
	{
		key: "er82",
	},
	{
		key: "er92",
	},
	{
		key: "er103",
	},
	{
		key: "er14",
	},
];

export const SUPERFICIAL_ER_COLS = [
	{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
	{
		key: `ER ${CONTRIBUTION.PENSION_PLAN}`,
		pair: "ER_EPPSuperficial",
		isEditable: true,
	},
	{
		key: `ER ${CONTRIBUTION.HEALTH_PLAN}`,
		pair: "ER_EHPSuperficial",
		isEditable: true,
	},
	{
		key: `${CONTRIBUTION.EI} (ER)`,
		pair: "ER_EISuperficial",
		isEditable: true,
	},
	{
		key: `${CONTRIBUTION.CPP} (ER)`,
		pair: "ER_CPPSuperficial",
		isEditable: true,
	},
	{
		key: "er35",
	},
	{
		key: "er46",
	},
	{
		key: "er53",
	},
	{
		key: "er323",
	},
	{
		key: "er73",
	},
	{
		key: "er83",
	},
	{
		key: "er93",
	},
	{
		key: "er104",
	},
	{
		key: "er15",
	},
];
