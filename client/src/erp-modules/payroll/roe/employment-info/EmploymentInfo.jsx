import { Button, HStack, Stack, Text } from "@chakra-ui/react";
import RoeSection from "../RoeSection";
import { formatPayDate } from "../roeUtils";
import { FinalPayInfo } from "./FinalPayInfo";
import { OtherMoniesInfo } from "./OtherMoniesInfo";
import { SpecialPaymentsInfo } from "./SpecialPaymentsInfo";
import { StatPayInfo } from "./StatPayInfo";
import { TenureInfo } from "./TenureInfo";
import { VacationPayInfo } from "./VacationPayInfo";

const EMPTY_ROWS = {
	statHolidays: { date: "", amount: "" },
	otherMonies: { code: "", startDate: "", endDate: "", amount: "" },
	specialPayments: { code: "", startDate: "", endDate: "", amount: "", period: "" },
};

// ROE-01 tab 2: tenure and positions, final pay (block 12, 14, 16) and the
// separation payments (block 17, 19). Save checks the required fields and
// moves on to the employer.
const EmploymentInfo = ({
	formData,
	handleFieldChange,
	payPeriodOptions,
	sections,
	toggleSection,
	done,
	onSave,
	errors,
}) => {
	const e = formData?.employmentInfo || {};
	const rows = (section) => (e[section]?.length ? e[section] : [{ ...EMPTY_ROWS[section] }]);
	const roeData = {
		statHolidays: rows("statHolidays"),
		otherMonies: rows("otherMonies"),
		specialPayments: rows("specialPayments"),
	};
	const handleArrayChange = (section, index, name, value) => {
		const arr = roeData[section].map((row, i) => (i === index ? { ...row, [name]: value } : row));
		handleFieldChange("employmentInfo", section, arr);
	};
	const addArrayRow = (section, template) =>
		handleFieldChange("employmentInfo", section, [...roeData[section], { ...template }]);
	const removeArrayRow = (section, index) =>
		handleFieldChange(
			"employmentInfo",
			section,
			roeData[section].filter((_, i) => i !== index),
		);
	const arrayProps = { roeData, handleArrayChange, removeArrayRow, addArrayRow };

	return (
		<Stack spacing={4} p={2}>
			<RoeSection
				title="Tenure & Positions"
				isOpen={sections.tenure}
				onToggle={() => toggleSection("tenure")}
				isDone={done.employment}
				summary={e.employmentLeaveDate ? `Last day worked ${formatPayDate(e.employmentLeaveDate)}` : ""}
			>
				<TenureInfo formData={formData} handleFieldChange={handleFieldChange} />
			</RoeSection>
			<RoeSection
				title="Final Pay"
				isOpen={sections.finalPay}
				onToggle={() => toggleSection("finalPay")}
				isDone={done.employment}
				summary={e.reasonCode || ""}
			>
				<FinalPayInfo
					formData={formData}
					handleFieldChange={handleFieldChange}
					payPeriodOptions={payPeriodOptions}
				/>
			</RoeSection>
			<RoeSection
				title="Separation Payments (optional)"
				isOpen={sections.payments}
				onToggle={() => toggleSection("payments")}
				isDone={done.employment}
			>
				<Stack spacing={4}>
					<VacationPayInfo handleFieldChange={handleFieldChange} formData={formData} />
					<StatPayInfo {...arrayProps} />
					<OtherMoniesInfo {...arrayProps} />
					<SpecialPaymentsInfo {...arrayProps} formData={formData} />
				</Stack>
			</RoeSection>
			{errors?.length > 0 && (
				<Text color="red.500" fontSize="sm">
					{errors.join("; ")}
				</Text>
			)}
			<HStack justify="end">
				<Button bg="var(--banner_bg)" color="white" _hover={{ bg: "#4a2b4a" }} onClick={onSave}>
					Save
				</Button>
			</HStack>
		</Stack>
	);
};

export default EmploymentInfo;
