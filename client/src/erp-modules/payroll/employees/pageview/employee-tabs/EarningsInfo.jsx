import { Flex, FormLabel, HStack, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";

const EarningsInfo = ({ role, handleSubmit }) => {
	const { title, payRate, typeOfEarning } = role;
	const [formData, setFormData] = useState({
		title,
		payRate,
		typeOfEarning: typeOfEarning || "Hourly",
		fullTimeStandardHours: role?.fullTimeStandardHours,
		partTimeStandardHours: role?.partTimeStandardHours,
	});

	const isFTSalaried = formData.typeOfEarning === "Full Time Salaried";
	const isPTSalaried = formData.typeOfEarning === "Part Time Salaried";
	return (
		<Stack>
			<HStack mt={2}>
				<FormLabel>Select earning type</FormLabel>
				<RadioGroup
					value={formData.typeOfEarning || ""}
					onChange={(value) => {
						setFormData((prev) => ({
							...prev,
							typeOfEarning: value,
						}));
					}}
				>
					<Flex gap={5} align={"center"}>
						{["Hourly", "Full Time Salaried", "Part Time Salaried"]?.map((option, index) => (
							<Radio key={index} value={option} border={"1px solid var(--gray2_color)"}>
								<TextTitle size={"sm"} title={option} />
							</Radio>
						))}
					</Flex>
				</RadioGroup>
			</HStack>
			<InputFormControl
				type="number"
				label="Regular Pay"
				name="payRate"
				placeholder="Enter Payrate"
				valueText={formData.payRate || ""}
				handleChange={(e) => {
					setFormData((prev) => ({
						...prev,
						payRate: e.target.value,
					}));
				}}
			/>
			{isFTSalaried ? (
				<InputFormControl
					type="number"
					label="Standard Hours (FT)"
					name="fullTimeStandardHours"
					placeholder="Enter Full Time Hours"
					valueText={formData.fullTimeStandardHours || ""}
					handleChange={(e) => {
						setFormData((prev) => ({
							...prev,
							fullTimeStandardHours: e.target.value,
						}));
					}}
				/>
			) : isPTSalaried ? (
				<InputFormControl
					type="number"
					label="Standard Hours (PT)"
					name="partTimeStandardHours"
					placeholder="Enter Part Time Hours"
					valueText={formData.partTimeStandardHours || ""}
					handleChange={(e) => {
						setFormData((prev) => ({
							...prev,
							partTimeStandardHours: e.target.value,
						}));
					}}
				/>
			) : (
				<></>
			)}
			<PrimaryButton
				w="100px"
				size="xs"
				name="Save"
				onOpen={() => {
					handleSubmit(formData);
				}}
			/>
		</Stack>
	);
};

export default EarningsInfo;
