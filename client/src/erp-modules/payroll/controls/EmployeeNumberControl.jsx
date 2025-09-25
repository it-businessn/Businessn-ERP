import { Checkbox, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { COMPANIES } from "constant";
import moment from "moment";
import { useEffect, useState } from "react";

export const EmployeeNumberControl = ({ company, formData, handleChange }) => {
	const [autoGenerate, setAutoGenerate] = useState(false);

	useEffect(() => {
		if (autoGenerate) {
			const currentDate = moment().format("YYYYMMDD");
			const initials =
				company === COMPANIES.NW
					? "NW"
					: company == COMPANIES.CORNERSTONE
					? "CR"
					: company.slice(0, 2).toUpperCase();
			const newID = `${initials}${currentDate}${Math.floor(Math.random() * 10) + 10}`;
			handleChange("employmentInfo", "employeeNo", newID);
		}
	}, [autoGenerate]);

	return (
		<FormControl isRequired>
			<FormLabel size="sm">Employee Number</FormLabel>
			<Input
				size="sm"
				value={formData.employmentInfo.employeeNo || ""}
				onChange={(e) => handleChange("employmentInfo", "employeeNo", e.target.value)}
				placeholder="Enter employee number"
			/>
			<Checkbox
				isChecked={autoGenerate}
				colorScheme="facebook"
				onChange={(e) => setAutoGenerate(e.target.checked)}
			>
				Auto-generate Employee Number
			</Checkbox>
		</FormControl>
	);
};
