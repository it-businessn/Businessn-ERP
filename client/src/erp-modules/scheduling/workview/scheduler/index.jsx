import BoxCard from "components/ui/card";
import SelectFormControl from "components/ui/form/SelectFormControl";
import { useEffect } from "react";
import SchedulingCalendar from "./SchedulingCalendar";

const Scheduler = ({
	newShiftAdded,
	setRefresh,
	company,
	locations,
	empName,
	location,
	setLocation,
	currentDate,
	setCurrentDate,
}) => {
	useEffect(() => {
		setLocation(locations?.[0]?.name);
	}, [locations]);

	return (
		<BoxCard fontWeight="bold">
			{locations && (
				<SelectFormControl
					w="20%"
					valueParam="name"
					name="name"
					label=""
					valueText={location || ""}
					handleChange={(e) => setLocation(e.target.value)}
					options={locations}
					placeholder="Select Location"
				/>
			)}
			<SchedulingCalendar
				empName={empName}
				location={location}
				company={company}
				setRefresh={setRefresh}
				newShiftAdded={newShiftAdded}
				currentDate={currentDate}
				setCurrentDate={setCurrentDate}
			/>
		</BoxCard>
	);
};

export default Scheduler;
