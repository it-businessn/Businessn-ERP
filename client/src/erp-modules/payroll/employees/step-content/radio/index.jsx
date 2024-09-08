import { Flex, FormLabel, HStack, Radio, RadioGroup } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { hideLabel } from "../Record";

const RadioTypeRecord = ({ param, formData, setFormData, handleConfirm }) => {
	return (
		<HStack visibility={hideLabel(param.name) && "hidden"}>
			<FormLabel>{param.name}</FormLabel>
			<RadioGroup
				value={formData[param.param_key]}
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
						<Radio
							key={index}
							value={option}
							border={"1px solid var(--gray2_color)"}
						>
							<TextTitle size={"sm"} title={option} />
						</Radio>
					))}
				</Flex>
			</RadioGroup>
		</HStack>
	);
};

export default RadioTypeRecord;
