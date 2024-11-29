import { Checkbox, FormLabel, HStack, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import DateTypeRecord from "./date";
import InputRecord from "./input";
import RadioTypeRecord from "./radio";
import SelectTypeRecord from "./select";
import MultiSelectRecord from "./select/MultiSelect";

export const hideLabel = (name) => name.includes("sfsgdsgdsgdsg");

const Record = ({
	config,
	title,
	formData,
	setFormData,
	handleConfirm,
	isDisabled,
	isLoading,
	handleSubmit,
	isOnboarding,
	readOnly,
	isBalanceInfo,
	carryFwd,
	setCarryFwd,
	isCPPExempt,
	isEIExempt,
	setIsCPPExempt,
	setIsEIExempt,
}) => {
	return (
		<>
			<TextTitle title={title} />
			<HStack align={"start"} justify={"start"} mb={2}>
				{config.map((tab, index) => (
					<VStack align={"start"} key={`${tab.type}**${index * 2}`}>
						{tab?.control === "checkbox" ? (
							<Checkbox
								colorScheme={"facebook"}
								isChecked={carryFwd || isEIExempt || isCPPExempt}
								onChange={() => {
									if (carryFwd !== undefined) {
										setCarryFwd(!carryFwd);
									}
									if (isEIExempt !== undefined) {
										setIsEIExempt(!isEIExempt);
									}
									if (isCPPExempt !== undefined) {
										setIsCPPExempt(!isCPPExempt);
									}
									handleSubmit();
								}}
							>
								<FormLabel>{tab.type}</FormLabel>
							</Checkbox>
						) : (
							<FormLabel visibility={hideLabel(tab.type) && "hidden"}>{tab.type}</FormLabel>
						)}
						{tab.params.map((param) => {
							return param?.control === "label" ? (
								<FormLabel color={"var(--status_button_border)"} key={param.name}>
									{param.name}
								</FormLabel>
							) : param?.control === "select" ? (
								<SelectTypeRecord
									size={"md"}
									key={param.name}
									formData={formData}
									param={param}
									setFormData={setFormData}
									handleConfirm={handleConfirm}
								/>
							) : param?.control === "radio" ? (
								<RadioTypeRecord
									key={param.name}
									formData={formData}
									param={param}
									setFormData={setFormData}
									handleConfirm={handleConfirm}
									isOnboarding={isOnboarding}
								/>
							) : param?.control === "date" ? (
								<DateTypeRecord
									required={param?.mandatory}
									isOnboarding={isOnboarding}
									key={param.name}
									formData={formData}
									param={param}
									setFormData={setFormData}
									handleConfirm={handleConfirm}
								/>
							) : param?.control === "multiselect" ? (
								<MultiSelectRecord
									key={param.name}
									formData={formData}
									param={param}
									setFormData={setFormData}
									handleConfirm={handleConfirm}
								/>
							) : (
								<InputRecord
									key={param.name}
									formData={formData}
									param={param}
									setFormData={setFormData}
									handleConfirm={handleConfirm}
									isOnboarding={isOnboarding}
									readOnly={readOnly}
									isBalanceInfo={isBalanceInfo}
								/>
							);
						})}
					</VStack>
				))}
			</HStack>
			{!readOnly && (
				<PrimaryButton
					size="xs"
					isDisabled={isDisabled}
					name={"Save"}
					isLoading={isLoading}
					loadingText="Loading"
					onOpen={handleSubmit}
				/>
			)}
		</>
	);
};

export default Record;
