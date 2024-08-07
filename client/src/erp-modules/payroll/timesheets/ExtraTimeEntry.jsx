import { Td, Tr } from "@chakra-ui/react";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { getDefaultDate } from "utils";

const ExtraTimeEntry = ({
	name,
	approveStatus,
	dept,
	param_key,
	type,
	startTime,
	endTime,
	totalBreaks,
	totalHours,
	createdOn,
}) => {
	const initialFormData = { startTime, endTime };
	const [formData, setFormData] = useState(initialFormData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleConfirm = () => console.log(param_key, formData);
	return (
		<Tr>
			<Td>
				<TextTitle title={name} />
			</Td>
			<Td>
				<TextTitle title={getDefaultDate(createdOn)} />
			</Td>
			<Td>{approveStatus}</Td>
			<Td>{dept}</Td>
			<Td>{param_key}</Td>
			<Td>{type}</Td>
			<Td>
				<DateTimeFormControl
					label={""}
					hideTimeLabel
					valueText2={startTime}
					name2="startTime"
					handleChange={handleChange}
					required
					handleConfirm={handleConfirm}
				/>
			</Td>
			<Td>
				<DateTimeFormControl
					label={""}
					hideTimeLabel
					valueText2={endTime}
					name2="endTime"
					handleChange={handleChange}
					required
					handleConfirm={handleConfirm}
				/>
			</Td>
			<Td>{totalBreaks}</Td>
			<Td>{totalHours}</Td>
			<Td />
		</Tr>
	);
};

export default ExtraTimeEntry;
