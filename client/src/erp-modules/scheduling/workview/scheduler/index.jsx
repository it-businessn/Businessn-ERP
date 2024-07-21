import BoxCard from "components/ui/card";
import SelectFormControl from "components/ui/form/SelectFormControl";
import SchedulingCalendar from "./SchedulingCalendar";

const Scheduler = ({ newEmployeeAdded, setRefresh, company }) => (
	<BoxCard fontWeight="bold">
		<SelectFormControl
			w="20%"
			name="type"
			label={""}
			valueText={"meeting"}
			handleChange={() => {}}
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
	</BoxCard>
);

export default Scheduler;
