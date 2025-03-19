import { Flex, FormLabel, HStack, Radio, RadioGroup } from "@chakra-ui/react";
import MandatoryField from "components/ui/form/MandatoryField";
import TextTitle from "components/ui/text/TextTitle";
import { HIDE_ONBOARDING_SECTION } from "erp-modules/payroll/workview/data";
import { hideLabel } from "../Record";

const RadioTypeRecord = ({
	param,
	formData,
	setFormData,
	handleConfirm,
	isOnboarding,
	required,
}) => {
	return (
		(!isOnboarding || (isOnboarding && !HIDE_ONBOARDING_SECTION.includes(param.name))) && (
			<HStack visibility={hideLabel(param.name) && "hidden"}>
				<FormLabel>
					{param.name} {required && <MandatoryField color={"red"} />}
				</FormLabel>
				<RadioGroup
					value={formData[param.param_key] || ""}
					onChange={(value) => {
						setFormData((prev) => ({
							...prev,
							[param.param_key]: value,
						}));
						handleConfirm();
					}}
				>
					<Flex gap={5} align={"center"}>
						{param?.options?.map((option, index) => (
							<Radio key={index} value={option} border={"1px solid var(--gray2_color)"}>
								<TextTitle size={"sm"} title={option} />
							</Radio>
						))}
					</Flex>
				</RadioGroup>
			</HStack>
		)
	);
};

export default RadioTypeRecord;
