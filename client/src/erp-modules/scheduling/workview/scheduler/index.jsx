import { Box } from "@chakra-ui/react";
import SelectFormControl from "components/ui/form/SelectFormControl";
import SchedulingCalendar from "./SchedulingCalendar";

const Scheduler = ({ newEmployeeAdded, setRefresh, company }) => {
	return (
		<Box
			p="1em"
			bg={"var(--primary_bg)"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
		>
			<SelectFormControl
				w="20%"
				name="type"
				label={""}
				valueText={"meeting"}
				// handleChange={handleInputChange}
				options={[
					{
						name: "Location 1",
						value: "meeting",
					},
				]}
			/>
			<SchedulingCalendar
				company={company}
				setRefresh={setRefresh}
				newEmployeeAdded={newEmployeeAdded}
			/>
		</Box>
	);
};

export default Scheduler;
