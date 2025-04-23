import BoxCard from "components/ui/card";
import SelectFormControl from "components/ui/form/SelectFormControl";
import { useEffect, useState } from "react";
import SchedulingCalendar from "./SchedulingCalendar";

const Scheduler = ({ newShiftAdded, setRefresh, company, locations, empName }) => {
	const [location, setLocation] = useState(null);

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
			/>
		</BoxCard>
	);
};

export default Scheduler;
