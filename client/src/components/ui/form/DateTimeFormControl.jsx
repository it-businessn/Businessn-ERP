import { FormLabel, Input } from "@chakra-ui/react";
import FormControlMain from ".";

const DateTimeFormControl = ({
	valueText1,
	valueText2,
	handleChange,
	required,
	label,
	name1,
	name2,
	hideLabel,
	size,
}) => {
	return (
		<>
			<FormControlMain flex="1">
				<FormLabel display={hideLabel && "none"}>{label}</FormLabel>
				<Input
					size={size}
					type="date"
					name={name1}
					value={valueText1}
					onChange={handleChange}
					required={required}
				/>
			</FormControlMain>
			{name2 && (
				<FormControlMain flex="1">
					<FormLabel>Time</FormLabel>
					<Input
						type="time"
						name={name2}
						value={valueText2}
						onChange={handleChange}
						required={required}
					/>
				</FormControlMain>
			)}
		</>
	);
};

export default DateTimeFormControl;
