import { Checkbox, Select, VStack } from "@chakra-ui/react";
import { useState } from "react";

const MultiSelectCheckboxDropdown = () => {
	const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

	const [selectedOptions, setSelectedOptions] = useState([]);

	const handleCheckboxChange = (option) => {
		setSelectedOptions((prevSelected) =>
			prevSelected.includes(option)
				? prevSelected.filter((item) => item !== option)
				: [...prevSelected, option],
		);
	};

	return (
		<VStack spacing={4}>
			{options.map((option) => (
				<Checkbox
					colorScheme="facebook"
					key={option}
					isChecked={selectedOptions.includes(option)}
					onChange={() => handleCheckboxChange(option)}
				>
					{option}
				</Checkbox>
			))}

			<Select
				placeholder="Select options"
				value={selectedOptions}
				onChange={(e) =>
					setSelectedOptions(
						Array.from(e.target.selectedOptions, (option) => option.value),
					)
				}
				multiple
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</Select>
		</VStack>
	);
};
export default MultiSelectCheckboxDropdown;
