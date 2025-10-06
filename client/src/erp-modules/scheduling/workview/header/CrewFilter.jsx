import { FormLabel, HStack, Select } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

export const CrewFilter = ({ crews, selectedCrew, setSelectedCrew, timeFormat, setTimeFormat }) => {
	return (
		<HStack justify="space-between">
			<HStack alignItems={"center"}>
				<FormLabel>
					<TextTitle title="Crew" />
				</FormLabel>
				<Select
					size={"sm"}
					value={selectedCrew || ""}
					onChange={(e) => {
						if (e.target.value) setSelectedCrew(e.target.value);
					}}
					placeholder="Select crew"
				>
					{crews?.map(({ _id, name }) => (
						<option key={_id} value={name}>
							{name}
						</option>
					))}
				</Select>
			</HStack>
			<HStack alignItems={"center"}>
				<FormLabel>
					<TextTitle title="Time Format" />
				</FormLabel>
				<Select
					size={"sm"}
					value={timeFormat}
					onChange={(e) => {
						if (e.target.value) setTimeFormat(e.target.value);
					}}
					placeholder="Select time format"
				>
					<option value="12">12-hour</option>
					<option value="24">24-hour</option>
				</Select>
			</HStack>
		</HStack>
	);
};
