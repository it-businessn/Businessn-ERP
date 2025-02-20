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
		key: "er4",
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
		key: "er3",
	},
	{
		key: "er4",
	},
	{
		key: "er3",
	},
	{
		key: "er4",
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
		key: "er3",
	},
	{
		key: "er4",
	},
	{
		key: "er3",
	},
	{
		key: "er4",
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

export const SUPERFICIAL_ER_COLS = [
	{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
	{
		key: `ER ${CONTRIBUTION.PENSION_PLAN}`,
		pair: "EPP",
		isEditable: true,
	},
	{
		key: `ER ${CONTRIBUTION.HEALTH_PLAN}`,
		pair: "EHP",
		isEditable: true,
	},
	{
		key: `${CONTRIBUTION.EI} (ER)`,
		pair: "EI",
		isEditable: true,
	},
	{
		key: `${CONTRIBUTION.CPP} (ER)`,
		pair: "CPP",
		isEditable: true,
	},
	{
		key: "er3",
	},
	{
		key: "er4",
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
