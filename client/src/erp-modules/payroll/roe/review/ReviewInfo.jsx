import { IconButton, Stack } from "@chakra-ui/react";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import { FaPrint } from "react-icons/fa";
import EarningsInfo from "../EarningsInfo";
import { PersonalInfo } from "../employee-info/PersonalInfo";
import { ContactInfo } from "../employer-info/ContactInfo";
import { FinalPayInfo } from "../employment-info/FinalPayInfo";
import { TenureInfo } from "../employment-info/TenureInfo";
import { VacationPayInfo } from "../employment-info/VacationPayInfo";
import { OtherMoniesInfoReview } from "./OtherMoniesInfoReview";
import { SpecialPaymentsInfoReview } from "./SpecialPaymentsInfoReview";
import { StatPayInfoReview } from "./StatPayInfoReview";

const ReviewInfo = ({ formData, handleFieldChange, setFormData }) => {
	return (
		<Stack spacing={3} p={3} border={"1px solid black"}>
			<IconButton
				size={"lg"}
				icon={<FaPrint />}
				aria-label="Print"
				variant="round"
				// onClick={handleClick}
				// isDisabled={isPrintDisabled}		{/* <ROEFromXML /> */}
			/>
			<PersonalInfo isReadOnly formData={formData} />
			<TenureInfo isReadOnly formData={formData} />
			<FinalPayInfo isReadOnly formData={formData} />
			<VacationPayInfo isReadOnly formData={formData} />
			<StatPayInfoReview formData={formData} />
			<OtherMoniesInfoReview formData={formData} />
			<SpecialPaymentsInfoReview formData={formData} />
			<ContactInfo formData={formData} isReadOnly />
			<EarningsInfo formData={formData} setFormData={setFormData} />
			<TextAreaFormControl
				maxLength={500}
				label="Comments"
				name="message"
				valueText={formData?.comments?.message || ""}
				handleChange={(e) => handleFieldChange("comments", "message", e.target.value)}
				required
				rows={6}
			/>
		</Stack>
	);
};

export default ReviewInfo;
