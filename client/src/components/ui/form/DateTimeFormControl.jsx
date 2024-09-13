import { FormLabel, Input } from "@chakra-ui/react";
import FormControlMain from ".";
import RequiredLabel from "./RequiredLabel";

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
	timeLabel = "Time",
	hideTimeLabel,
	border,
	handleConfirm,
	minDate,
}) => {
	return (
		<>
			{name1 && (
				<FormControlMain flex="1">
					{required ? (
						<RequiredLabel
							hideLabel={hideLabel}
							label={label}
							required={required}
						/>
					) : (
						<FormLabel display={hideLabel && "none"}>{label}</FormLabel>
					)}
					<Input
						min={minDate}
						size={size}
						type="date"
						name={name1}
						value={valueText1}
						onChange={handleChange}
						required={required}
						border={border}
					/>
				</FormControlMain>
			)}
			{name2 && (
				<FormControlMain flex="1">
					<FormLabel display={hideTimeLabel && "none"}>{timeLabel}</FormLabel>
					<Input
						onBlur={handleConfirm}
						type="time"
						name={name2}
						value={valueText2}
						onChange={handleChange}
						required={required}
						border={border}
					/>
				</FormControlMain>
			)}
		</>
	);
};

export default DateTimeFormControl;
