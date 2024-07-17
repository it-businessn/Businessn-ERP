import { FormLabel, HStack, VStack } from "@chakra-ui/react";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";

const Record = ({ data, title }) => {
	return (
		<>
			<TextTitle title={title} />
			<HStack align={"start"} justify={"start"}>
				{data.map((tab) => (
					<VStack align={"start"} key={tab.type}>
						<FormLabel>{tab.type}</FormLabel>
						{tab.params.map((param) => {
							console.log(param, param.name === "");
							return (
								<InputFormControl
									key={param.name}
									label={param.name}
									name="regPay"
									valueText={"20"}
									fontWeight={param.name === "Address" && "bold"}
									display={param.name === "Address" && "none"}
									visibility={param.name === "ss" && "hidden"}
									// handleChange={handleChange}
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
