import { Checkbox, FormLabel, HStack, Textarea, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import FormControlMain from "components/ui/form";
import RequiredLabel from "components/ui/form/RequiredLabel";
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
	isContribution,
	showAddForm,
	formContent,
}) => {
	return (
		<>
			<TextTitle title={title} />
			{showAddForm && formContent}
			<HStack align={"start"} justify={"start"} mb={2}>
				{config?.map((tab, index) => (
					<VStack align={"start"} key={`${tab.type}**${index * 2}`}>
						{tab?.control === "checkbox" ? (
							<Checkbox
								colorScheme={"facebook"}
								isChecked={carryFwd || isEIExempt || isCPPExempt}
								onChange={() => {
									setCarryFwd(!carryFwd);
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
							const isReadOnly =
								readOnly ||
								(param.name.includes("Pension Contribution - ER") &&
									formData?.typeOfPensionERTreatment?.includes("No")) ||
								(param.name.includes("Dental - ER") &&
									formData?.typeOfDentalERTreatment?.includes("No")) ||
								(param.name.includes("Extended Health - ER") &&
									formData?.typeOfExtendedHealthERTreatment?.includes("No")) ||
								(param.name.includes("Pension Contribution - EE") &&
									formData?.typeOfPensionEETreatment?.includes("No")) ||
								(param.name.includes("Dental - EE") &&
									formData?.typeOfDentalEETreatment?.includes("No")) ||
								(param.name.includes("Extended Health - EE") &&
									formData?.typeOfExtendedHealthEETreatment?.includes("No")) ||
								(param.name.includes("Union Dues") &&
									formData?.typeOfUnionDuesTreatment?.includes("No"));

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
									required={param?.mandatory}
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
							) : param?.control === "textarea" ? (
								<FormControlMain key={param.name}>
									<RequiredLabel
										name={param.param_key}
										label={param.name}
										required={param?.mandatory}
										htmlFor={param.param_key}
									/>
									<Textarea
										onBlur={handleConfirm}
										name={param.param_key}
										value={formData[param.param_key]?.toLocaleString() || ""}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												[param.param_key]: e.target.value,
											}))
										}
										required={param?.mandatory}
									/>
								</FormControlMain>
							) : (
								<InputRecord
									key={param.name}
									formData={formData}
									param={param}
									setFormData={setFormData}
									handleConfirm={handleConfirm}
									isOnboarding={isOnboarding}
									readOnly={isReadOnly}
									isBalanceInfo={isBalanceInfo}
									isContribution={isContribution}
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
