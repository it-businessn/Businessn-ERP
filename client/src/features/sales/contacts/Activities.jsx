import React, { useState } from "react";
import { Textarea, Button } from "@chakra-ui/react";

import * as api from "services";

const Activities = ({ contactId }) => {
	const [description, setDescription] = useState("");

	const handleLogActivity = async () => {
		try {
			await api.getActivities({
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
