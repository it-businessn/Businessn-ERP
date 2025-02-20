import { COLS, CONTRIBUTION } from "constant";

export const REGULAR_EE_COLS = [
	{
		key: COLS.EMP_NAME,
		pair: "obj",
		pair_key: "fullName",
		round: true,
	},
	// {
	// 	key: `${CONTRIBUTION.EI} (EE)`,
	// 	pair: "EI",
	// 	align: "center",
	// 	round: true,
	// },
	// {
	// 	key: `${CONTRIBUTION.CPP} (EE)`,
	// 	pair: "CPP",
	// 	align: "center",
	// 	round: true,
	// },
	{ key: COLS.UNION_DUE, pair: "unionDues", align: "center", round: true },
	{
		key: `Employer ${CONTRIBUTION.PENSION_PLAN} (EE)`,
		pair: "EPP",
		align: "center",
		round: true,
	},
	{
		key: `Employer ${CONTRIBUTION.HEALTH_PLAN} (EE)`,
		pair: "EHP",
		align: "center",
		round: true,
	},
	{
		key: "ee1",
	},
	{
		key: "ee2",
	},
	{
		key: "ee3",
	},
	{
		key: "ee4",
	},
	{
		key: "ee5",
	},
	{
		key: "ee6",
	},
	{
		key: "ee7",
	},
	{
		key: "ee8",
	},
	{
		key: "ee9",
	},
	{
		key: "ee10",
	},
];

export const PAYOUT_EE_COLS = [
	{
		key: COLS.EMP_NAME,
		pair: "obj",
		pair_key: "fullName",
		round: true,
	},
	// {
	// 	key: `${CONTRIBUTION.EI} (EE)`,
	// 	pair: "EI",
	// 	align: "center",
	// 	round: true,
	// },
	// {
	// 	key: `${CONTRIBUTION.CPP} (EE)`,
	// 	pair: "CPP",
	// 	align: "center",
	// 	round: true,
	// },
	{ key: COLS.UNION_DUE, pair: "unionDues", align: "center", round: true },
	{
		key: `Employer ${CONTRIBUTION.PENSION_PLAN} (EE)`,
		pair: "EPP",
		align: "center",
		round: true,
	},
	{
		key: `Employer ${CONTRIBUTION.HEALTH_PLAN} (EE)`,
		pair: "EHP",
		align: "center",
		round: true,
	},
	{
		key: "ee1",
	},
	{
		key: "ee2",
	},
	{
		key: "ee3",
	},
	{
		key: "ee4",
	},
	{
		key: "ee5",
	},
	{
		key: "ee6",
	},
	{
		key: "ee7",
	},
	{
		key: "ee8",
	},
	{
		key: "ee9",
	},
	{
		key: "ee10",
	},
];

export const MANUAL_EE_COLS = [
	{
		key: COLS.EMP_NAME,
		pair: "obj",
		pair_key: "fullName",
		round: true,
	},
	// {
	// 	key: `${CONTRIBUTION.EI} (EE)`,
	// 	pair: "EI",
	// 	align: "center",
	// 	round: true,
	// },
	// {
	// 	key: `${CONTRIBUTION.CPP} (EE)`,
	// 	pair: "CPP",
	// 	align: "center",
	// 	round: true,
	// },
	{ key: COLS.UNION_DUE, pair: "unionDues", align: "center", round: true },
	{
		key: `Employer ${CONTRIBUTION.PENSION_PLAN} (EE)`,
		pair: "EPP",
		align: "center",
		round: true,
	},
	{
		key: `Employer ${CONTRIBUTION.HEALTH_PLAN} (EE)`,
		pair: "EHP",
		align: "center",
		round: true,
	},
	{
		key: "ee1",
	},
	{
		key: "ee2",
	},
	{
		key: "ee3",
	},
	{
		key: "ee4",
	},
	{
		key: "ee5",
	},
	{
		key: "ee6",
	},
	{
		key: "ee7",
	},
	{
		key: "ee8",
	},
	{
		key: "ee9",
	},
	{
		key: "ee10",
	},
];

export const SUPERFICIAL_EE_COLS = [
	{
		key: COLS.EMP_NAME,
		pair: "obj",
		pair_key: "fullName",
		round: true,
	},
	{ key: COLS.UNION_DUE, pair: "unionDuesSuperficial", align: "center", isEditable: true },
	{
		key: `Employer ${CONTRIBUTION.PENSION_PLAN} (EE)`,
		pair: "EE_EPPSuperficial",
		isEditable: true,
	},
	{
		key: `Employer ${CONTRIBUTION.HEALTH_PLAN} (EE)`,
		pair: "EE_EHPSuperficial",
		isEditable: true,
	},
	{
		key: `${CONTRIBUTION.EI} (EE)`,
		pair: "EE_EISuperficial",
		isEditable: true,
	},
	{
		key: `${CONTRIBUTION.CPP} (EE)`,
		pair: "EE_CPPSuperficial",
		isEditable: true,
	},
	{
		key: "ee3",
	},
	{
		key: "ee4",
	},
	{
		key: "ee5",
	},
	{
		key: "ee6",
	},
	{
		key: "ee7",
	},
	{
		key: "ee8",
	},
	{
		key: "ee9",
	},
	{
		key: "ee10",
	},
];
