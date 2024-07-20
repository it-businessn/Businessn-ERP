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

const Record = ({ config, title, formData, setFormData, handleConfirm }) => {
	return (
		<>
			<TextTitle title={title} />
			<HStack align={"start"} justify={"start"}>
				{config.map((tab) => (
					<VStack align={"start"} key={tab.type}>
						<FormLabel visibility={tab.type.includes("ss") && "hidden"}>
							{tab.type}
						</FormLabel>
						{tab.params.map((param) => {
							return param?.control === "select" ? (
								<FormControl key={param.name}>
									<FormLabel>{param.name}</FormLabel>
									<Select
										icon={<FaCaretDown />}
										borderRadius="10px"
										size="sm"
										placeholder={`Select ${param.name}`}
										name={param.param_key}
										value={formData[param.param_key]}
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
								<HStack
									key={param.name}
									visibility={param.name === "ss" && "hidden"}
								>
									<FormLabel>{param.name}</FormLabel>
									<RadioGroup
										value={formData[param.param_key]}
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
									name={param.param_key}
									// type={param.param_type}// text or number
									valueText={formData[param.param_key]}
									fontWeight={param.name === "Address" && "bold"}
									display={param.name === "Address" && "none"}
									visibility={param.name === "ss" && "hidden"}
									handleChange={(e) =>
										setFormData((prev) => ({
											...prev,
											[param.param_key]: e.target.value,
										}))
									}
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
