import OutlineButton from "components/ui/button/OutlineButton";
import { COLS } from "constant";

export const REGULAR_AMT_ALLOCATE_COLS = [
	{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
	{
		key: "Total Amount",
		pair: "totalAmountAllocated",
		isTotal: true,
		align: "center",
		round: true,
	},
	{
		key: "Regular $",
		pair: "regPayAmt",
		isEditable: true,
	},
	{
		key: "Overtime $",
		pair: "OTPayAmt",
		isEditable: true,
	},
	{
		key: "Double OT $",
		pair: "dblOTPayAmt",
		isEditable: true,
	},
	{
		key: "Stat. Pay $",
		pair: "statPayAmt",
		isEditable: true,
	},
	{
		key: "Stat. Worked $",
		pair: "statWorkPayAmt",
		isEditable: true,
	},
	{
		key: "Vacation $",
		pair: "vacationPayAmt",
		isEditable: true,
	},
	{
		key: "Sick $",
		pair: "sickPayAmt",
		isEditable: true,
	},
	{
		key: "Commission $",
		pair: "commission",
		isEditable: true,
	},
	{ key: "Retroactive $", pair: "retroactive", isEditable: true },
	{ key: "Reimbursement $", pair: "reimbursement", isEditable: true },
	{ key: "Bonus $", pair: "bonus", isEditable: true },
	{
		key: "Termination Payout $",
		pair: "terminationPayout",
		isEditable: true,
	},
	{
		key: "Vacation Payout $",
		pair: "vacationPayout",
		isEditable: true,
	},
	{
		key: "Vac. Balance Adjustment $",
		pair: "vacationBalAdjust",
		isEditable: true,
	},
	{
		key: "Vac. Accrual $",
		pair: "vacationAccrual",
		isEditable: true,
	},
	{
		key: "Vac. Used $",
		pair: "vacationUsed",
		isEditable: true,
	},
	{
		key: "Federal Tax $",
		pair: "federalTax",
		isEditable: true,
	},
	{
		key: "Provincial Tax $",
		pair: "provTax",
		isEditable: true,
	},
	{
		key: "Income Tax $",
		pair: "incomeTax",
		isEditable: true,
	},
	{
		key: "",
		pair: <OutlineButton size="xs" name="setup" label="View Balances" mr={3} />,
	},
];

export const PAYOUT_AMT_ALLOCATE_COLS = [
	{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
	{
		key: "Total Amount",
		pair: "totalPayoutAmountAllocated",
		isTotal: true,
		align: "center",
		round: true,
	},
	{
		key: "Regular $",
		pair: "regPayAmtPayout",
		isEditable: true,
	},
	{
		key: "Overtime $",
		pair: "OTPayAmtPayout",
		isEditable: true,
	},
	{
		key: "Double OT $",
		pair: "dblOTPayAmtPayout",
		isEditable: true,
	},
	{
		key: "Stat. Pay $",
		pair: "statPayAmtPayout",
		isEditable: true,
	},
	{
		key: "Stat. Worked $",
		pair: "statWorkPayAmtPayout",
		isEditable: true,
	},
	{
		key: "Vacation $",
		pair: "vacationPayAmtPayout",
		isEditable: true,
	},
	{
		key: "Sick $",
		pair: "sickPayAmtPayout",
		isEditable: true,
	},
	{
		key: "Commission $",
		pair: "commissionPayout",
		isEditable: true,
	},
	{ key: "Retroactive $", pair: "retroactivePayout", isEditable: true },
	{ key: "Reimbursement $", pair: "reimbursementPayout", isEditable: true },
	{ key: "Bonus $", pair: "bonusPayout", isEditable: true },
	{
		key: "Termination Payout $",
		pair: "terminationPayoutPayout",
		isEditable: true,
	},
	{
		key: "Vacation Payout $",
		pair: "vacationPayoutPayout",
		isEditable: true,
	},
	{
		key: "Vac. Balance Adjustment $",
		pair: "vacationBalAdjustPayout",
		isEditable: true,
	},
	{
		key: "Vac. Accrual $",
		pair: "vacationAccrualPayout",
		isEditable: true,
	},
	{
		key: "Vac. Used $",
		pair: "vacationUsedPayout",
		isEditable: true,
	},
	{
		key: "Federal Tax $",
		pair: "federalTaxPayout",
		isEditable: true,
	},
	{
		key: "Provincial Tax $",
		pair: "provTaxPayout",
		isEditable: true,
	},
	{
		key: "Income Tax $",
		pair: "incomeTaxPayout",
		isEditable: true,
	},
	{
		key: "",
		pair: <OutlineButton size="xs" name="setup" label="View Balances" mr={3} />,
	},
];

export const MANUAL_AMT_ALLOCATE_COLS = [
	{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
	{
		key: "Total Amount",
		pair: "totalManualAmountAllocated",
		isTotal: true,
		align: "center",
		round: true,
	},
	{
		key: "Regular $",
		pair: "regPayAmtManual",
		isEditable: true,
	},
	{
		key: "Overtime $",
		pair: "OTPayAmtManual",
		isEditable: true,
	},
	{
		key: "Double OT $",
		pair: "dblOTPayAmtManual",
		isEditable: true,
	},
	{
		key: "Stat. Pay $",
		pair: "statPayAmtManual",
		isEditable: true,
	},
	{
		key: "Stat. Worked $",
		pair: "statWorkPayAmtManual",
		isEditable: true,
	},
	{
		key: "Vacation $",
		pair: "vacationPayAmtManual",
		isEditable: true,
	},
	{
		key: "Sick $",
		pair: "sickPayAmtManual",
		isEditable: true,
	},
	{
		key: "Commission $",
		pair: "commissionManual",
		isEditable: true,
	},
	{ key: "Retroactive $", pair: "retroactiveManual", isEditable: true },
	{ key: "Reimbursement $", pair: "reimbursementManual", isEditable: true },
	{ key: "Bonus $", pair: "bonusManual", isEditable: true },
	{
		key: "Termination Payout $",
		pair: "terminationPayoutManual",
		isEditable: true,
	},
	{
		key: "Vacation Payout $",
		pair: "vacationPayoutManual",
		isEditable: true,
	},
	{
		key: "Vac. Balance Adjustment $",
		pair: "vacationBalAdjustManual",
		isEditable: true,
	},
	{
		key: "Vac. Accrual $",
		pair: "vacationAccrualManual",
		isEditable: true,
	},
	{
		key: "Vac. Used $",
		pair: "vacationUsedManual",
		isEditable: true,
	},
	{
		key: "Federal Tax $",
		pair: "federalTaxManual",
		isEditable: true,
	},
	{
		key: "Provincial Tax $",
		pair: "provTaxManual",
		isEditable: true,
	},
	{
		key: "Income Tax $",
		pair: "incomeTaxManual",
		isEditable: true,
	},
	{
		key: "",
		pair: <OutlineButton size="xs" name="setup" label="View Balances" mr={3} />,
	},
];

export const SUPERFICIAL_AMT_ALLOCATE_COLS = [
	{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
	{
		key: "Total Amount",
		pair: "totalSuperficialAmountAllocated",
		isTotal: true,
		align: "center",
		round: true,
	},
	{
		key: "Regular $",
		pair: "regPayAmtSuperficial",
		isEditable: true,
	},
	{
		key: "Overtime $",
		pair: "OTPayAmtSuperficial",
		isEditable: true,
	},
	{
		key: "Double OT $",
		pair: "dblOTPayAmtSuperficial",
		isEditable: true,
	},
	{
		key: "Stat. Pay $",
		pair: "statPayAmtSuperficial",
		isEditable: true,
	},
	{
		key: "Stat. Worked $",
		pair: "statWorkPayAmtSuperficial",
		isEditable: true,
	},
	{
		key: "Vacation $",
		pair: "vacationPayAmtSuperficial",
		isEditable: true,
	},
	{
		key: "Sick $",
		pair: "sickPayAmtSuperficial",
		isEditable: true,
	},
	{
		key: "Commission $",
		pair: "commissionSuperficial",
		isEditable: true,
	},
	{ key: "Retroactive $", pair: "retroactiveSuperficial", isEditable: true },
	{ key: "Reimbursement $", pair: "reimbursementSuperficial", isEditable: true },
	{ key: "Bonus $", pair: "bonusSuperficial", isEditable: true },
	{
		key: "Termination Payout $",
		pair: "terminationPayoutSuperficial",
		isEditable: true,
	},
	{
		key: "Vacation Payout $",
		pair: "vacationPayoutSuperficial",
		isEditable: true,
	},
	{
		key: "Vac. Balance Adjustment $",
		pair: "vacationBalAdjustSuperficial",
		isEditable: true,
	},
	{
		key: "Vac. Accrual $",
		pair: "vacationAccrualSuperficial",
		isEditable: true,
	},
	{
		key: "Vac. Used $",
		pair: "vacationUsedSuperficial",
		isEditable: true,
	},
	{
		key: "Federal Tax $",
		pair: "federalTaxSuperficial",
		isEditable: true,
	},
	{
		key: "Provincial Tax $",
		pair: "provTaxSuperficial",
		isEditable: true,
	},
	{
		key: "Income Tax $",
		pair: "incomeTaxSuperficial",
		isEditable: true,
	},
	{
		key: "",
		pair: <OutlineButton size="xs" name="setup" label="View Balances" mr={3} />,
	},
];
