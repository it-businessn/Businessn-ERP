import {
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Radio,
	RadioGroup,
	Select,
	VStack,
} from "@chakra-ui/react";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { FaCaretDown } from "react-icons/fa";

const Record = ({ data, title }) => {
	return (
		<>
			<TextTitle title={title} />
			<HStack align={"start"} justify={"start"}>
				{data.map((tab) => (
					<VStack align={"start"} key={tab.type}>
						<FormLabel>{tab.type}</FormLabel>
						{tab.params.map((param) => {
							return param?.control === "select" ? (
								<FormControl>
									<FormLabel>{param.name}</FormLabel>
									<Select
										icon={<FaCaretDown />}
										borderRadius="10px"
										size="sm"
										placeholder={`Select ${param.name}`}
										name="name"
										value={"formData.name"}
										// onChange={handleChange}
									>
										{param.options?.map(({ type }) => (
											<option value={type} key={type}>
												{type}
											</option>
										))}
									</Select>
								</FormControl>
							) : param?.control === "radio" ? (
								<HStack visibility={param.name === "ss" && "hidden"}>
									<FormLabel>{param.name}</FormLabel>
									<RadioGroup
										value={"hasAward"}
										onChange={(e) => console.log(e)}
									>
										<Flex gap={5} align={"center"}>
											{["Yes", "No"].map((option, index) => (
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
							) : (
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
