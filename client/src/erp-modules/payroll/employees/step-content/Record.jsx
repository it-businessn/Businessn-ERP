import { FormLabel, HStack, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import DateTypeRecord from "./date";
import InputRecord from "./input";
import RadioTypeRecord from "./radio";
import SelectTypeRecord from "./select";

export const hideLabel = (name) => name.includes("sfsgdsgdsgdsg");

const Record = ({ config, title, formData, setFormData, handleConfirm }) => {
	return (
		<>
			<TextTitle title={title} />
			<HStack align={"start"} justify={"start"}>
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
		</>
	);
};

export default Record;
