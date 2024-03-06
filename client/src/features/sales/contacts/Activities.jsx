import { Button, Textarea } from "@chakra-ui/react";
import { useState } from "react";

import ActivityService from "services/ActivityService";

const Activities = ({ contactId }) => {
	const [description, setDescription] = useState("");

	const handleLogActivity = async () => {
		try {
			await ActivityService.getActivities({
				contactId,
				description,
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<Textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Log activity..."
			/>
			<Button bg="brand.logo_bg" size="sm" onClick={handleLogActivity}>
				Log Activity
			</Button>
		</div>
	);
};

export default Activities;
