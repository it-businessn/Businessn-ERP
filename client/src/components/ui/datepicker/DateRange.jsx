import { Input } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRange = ({ selected, startDate, onChange, minDate, endDate }) => (
	<DatePicker
		selected={selected}
		startDate={startDate}
		endDate={endDate}
		onChange={onChange}
		selectsStart
		selectsEnd
		minDate={minDate}
		customInput={<Input />}
		open={true}
	/>
);

export default DateRange;
