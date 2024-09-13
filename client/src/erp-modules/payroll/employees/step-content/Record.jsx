import { FormLabel, HStack, VStack } from "@chakra-ui/react";
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
}) => {
	return (
		<>
			<TextTitle title={title} />
			<HStack align={"start"} justify={"start"} mb={2}>
				{config.map((tab, index) => (
					<VStack align={"start"} key={`${tab.type}**${index * 2}`}>
						<FormLabel visibility={hideLabel(tab.type) && "hidden"}>
							{tab.type}
						</FormLabel>
						{tab.params.map((param) => {
							return param?.control === "select" ? (
								<SelectTypeRecord
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
								/>
							) : param?.control === "date" ? (
								<DateTypeRecord
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
								/>
							);
						})}
					</VStack>
				))}
			</HStack>
			<PrimaryButton
				size="xs"
				isDisabled={isDisabled}
				name={"Save"}
				isLoading={isLoading}
				loadingText="Loading"
				onOpen={handleSubmit}
			/>
		</>
	);
};

export default Record;
