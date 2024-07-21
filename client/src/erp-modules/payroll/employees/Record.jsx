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
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { FaCaretDown } from "react-icons/fa";
import { getDefaultDate } from "utils";

const Record = ({ config, title, formData, setFormData, handleConfirm }) => {
	const shouldHide = (name) => name.includes("sfsgdsgdsgdsg");
	return (
		<>
			<TextTitle title={title} />
			<HStack align={"start"} justify={"start"}>
				{config.map((tab, index) => (
					<VStack align={"start"} key={`${tab.type}**${index * 2}`}>
						<FormLabel visibility={shouldHide(tab.type) && "hidden"}>
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
										onChange={() => {}}
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
									visibility={shouldHide(param.name) && "hidden"}
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
							) : param?.control === "date" ? (
								<DateTimeFormControl
									key={param.name}
									label={param.name}
									valueText1={getDefaultDate(formData[param.param_key])}
									name1={param.param_key}
									handleChange={(e) =>
										setFormData((prev) => ({
											...prev,
											[param.param_key]: e.target.value,
										}))
									}
									required
								/>
							) : (
								<InputFormControl
									key={param.name}
									label={param.name}
									name={param.param_key}
									// type={param.param_type}// text or number
									valueText={formData[param.param_key]}
									fontWeight={param.name === "Address" && "bold"}
									display={param.name === "Address" && "none"}
									visibility={shouldHide(param.name) && "hidden"}
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
