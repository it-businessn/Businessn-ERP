import { HStack, Stack } from "@chakra-ui/react";

import PrimaryButton from "components/ui/button/PrimaryButton";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { getDefaultDate } from "utils/convertDate";

const MasterUserInfo = ({ company, handleNext }) => {
	const [isDisabled, setIsDisabled] = useState(true);
	const defaultUserInfo = {
		company,
		firstName: "",
		middleName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		position: "",
		startDate: null,
	};

	const [formData, setFormData] = useState(defaultUserInfo);

	useEffect(() => {
		if (formData?.firstName && formData?.lastName && formData?.email && formData?.phoneNumber) {
			setIsDisabled(false);
		}
	}, [formData?.firstName, formData?.lastName, formData?.email, formData?.phoneNumber]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		const { data } = await UserService.addMasterUser(formData);
		LocalStorageService.setItem("masterUserId", data._id);
		handleNext(1);
	};

	return (
		<Stack pb="2em">
			<HStack alignItems="center" spacing={5} w="50%">
				<InputFormControl
					required
					label="First Name"
					name="firstName"
					placeholder="Enter First Name"
					valueText={formData?.firstName || ""}
					handleChange={handleChange}
				/>

				<InputFormControl
					label="Middle Name"
					name="middleName"
					placeholder="Enter Middle Name"
					valueText={formData?.middleName}
					handleChange={handleChange}
				/>
				<InputFormControl
					required
					label="Last Name"
					name="lastName"
					placeholder="Enter Last Name"
					valueText={formData?.lastName}
					handleChange={handleChange}
				/>
			</HStack>
			<HStack alignItems="center" spacing={5} w="50%">
				<InputFormControl
					required
					type="email"
					label="Email"
					name="email"
					placeholder="Enter Email"
					valueText={formData?.email}
					handleChange={handleChange}
				/>
				<InputFormControl
					type="number"
					required
					label="Phone"
					name="phoneNumber"
					placeholder="Enter Phone"
					valueText={formData?.phoneNumber}
					handleChange={handleChange}
				/>
			</HStack>
			<HStack alignItems="center" spacing={5} w="50%">
				<InputFormControl
					label="Role / Position"
					name="position"
					placeholder="Enter Position"
					valueText={formData?.position}
					handleChange={handleChange}
				/>
				<DateTimeFormControl
					label="Start Date"
					valueText1={formData?.startDate ? getDefaultDate(formData?.startDate) : ""}
					name1="startDate"
					handleChange={handleChange}
				/>
			</HStack>
			<HStack>
				<PrimaryButton
					w="100px"
					size="xs"
					isDisabled={isDisabled}
					name="Add"
					onOpen={handleSubmit}
				/>
			</HStack>
		</Stack>
	);
};

export default MasterUserInfo;
