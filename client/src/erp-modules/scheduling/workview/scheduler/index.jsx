import BoxCard from "components/ui/card";
import SelectFormControl from "components/ui/form/SelectFormControl";

const Scheduler = ({ locations, setLocation, location }) => {
	return (
		<BoxCard fontWeight="bold">
			<SelectFormControl
				w="20%"
				valueParam="name"
				name="name"
				label="Location"
				valueText={location || ""}
				handleChange={(e) => {
					if (e.target.value) setLocation(e.target.value);
				}}
				options={locations}
				placeholder="Select location"
			/>
			{/* <SchedulingWeeklyCalendar
				isUserManager={isUserManager}
				empName={empName}
				company={company}
				setRefresh={setRefresh}
				newShiftAdded={newShiftAdded}
				currentDate={currentDate}
				setCurrentDate={setCurrentDate}
				handleItemClick={handleItemClick}
			/> */}
		</BoxCard>
	);
};

export default Scheduler;
