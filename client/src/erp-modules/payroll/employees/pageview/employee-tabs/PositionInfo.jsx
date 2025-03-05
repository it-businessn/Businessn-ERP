import { Button, FormLabel, HStack, Stack } from "@chakra-ui/react";

import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";

const PositionInfo = ({
	isOpen,
	setIsOpen,
	isDisabled,
	setIsDisabled,
	payGroups,
	department,
	costCentres,
	currentRoleInfo,
	handleSubmit,
	rolePos,
}) => {
	const defaultRoleInfo = currentRoleInfo || {
		title: "",
		description: "",
		employmentPayGroup: "",
		employmentCostCenter: "",
		employmentDepartment: "",
		timeManagementBadgeID: "",
		positions: [],
	};

	const [isEditable, setIsEditable] = useState(false);
	const [roleInfo, setRoleInfo] = useState(defaultRoleInfo);

	useEffect(() => {
		if (
			roleInfo.description &&
			roleInfo.title &&
			roleInfo.employmentCostCenter &&
			roleInfo.employmentPayGroup &&
			roleInfo.employmentDepartment
		) {
			if (!isOpen) setIsEditable(true);
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [isOpen, roleInfo]);

	return (
		<Stack>
			<Stack>
				{rolePos ? <TextTitle title={rolePos} /> : <FormLabel>New Role Details</FormLabel>}
				<HStack alignItems="self-start" spacing={5} w="70%">
					<Stack>
						{isOpen ? (
							<InputFormControl
								required={isOpen && true}
								label="Role title"
								name="title"
								placeholder="Enter title"
								valueText={roleInfo.title}
								handleChange={(e) => {
									setRoleInfo((prev) => ({
										...prev,
										title: e.target.value,
									}));
								}}
							/>
						) : (
							<>
								<FormLabel>Role title</FormLabel>
								<NormalTextTitle title={roleInfo.title} />
							</>
						)}

						<InputFormControl
							required={isOpen && true}
							label="Role description"
							name="description"
							maxLength={30}
							placeholder="Enter description"
							valueText={roleInfo.description}
							handleChange={(e) => {
								setRoleInfo((prev) => ({
									...prev,
									description: e.target.value,
								}));
							}}
						/>
						<InputFormControl
							label="Time Management Badge ID"
							name="timeManagementBadgeID"
							placeholder="Enter new Badge ID"
							valueText={roleInfo.timeManagementBadgeID}
							handleChange={(e) => {
								setRoleInfo((prev) => ({
									...prev,
									timeManagementBadgeID: e.target.value,
								}));
							}}
						/>
					</Stack>
					<Stack>
						<SelectFormControl
							required={isOpen && true}
							valueParam="name"
							name="employmentPayGroup"
							label="Pay Group"
							valueText={roleInfo.employmentPayGroup || ""}
							handleChange={(e) =>
								setRoleInfo((prevData) => ({
									...prevData,
									employmentPayGroup: e.target.value,
								}))
							}
							options={payGroups}
							placeholder="Select Pay Group"
						/>

						<SelectFormControl
							required={isOpen && true}
							valueParam="name"
							name="employmentCostCenter"
							label="Cost Center"
							valueText={roleInfo.employmentCostCenter || ""}
							handleChange={(e) =>
								setRoleInfo((prevData) => ({
									...prevData,
									employmentCostCenter: e.target.value,
								}))
							}
							options={costCentres}
							placeholder="Select Cost Center"
						/>
						<SelectFormControl
							required={isOpen && true}
							valueParam="name"
							name="employmentDepartment"
							label="Department"
							valueText={roleInfo.employmentDepartment || ""}
							handleChange={(e) =>
								setRoleInfo((prevData) => ({
									...prevData,
									employmentDepartment: e.target.value,
								}))
							}
							options={department}
							placeholder="Select Department"
						/>
					</Stack>
				</HStack>
				{isOpen && (
					<HStack>
						<PrimaryButton
							w="100px"
							size="xs"
							isDisabled={isDisabled}
							name="Add"
							onOpen={() => handleSubmit(roleInfo)}
						/>

						<Button size="xs" onClick={() => setIsOpen(false)} colorScheme="gray">
							Cancel
						</Button>
					</HStack>
				)}
			</Stack>

			{!isOpen && (
				<PrimaryButton
					w="100px"
					size="xs"
					isDisabled={!isEditable}
					name="Save"
					onOpen={() => handleSubmit(roleInfo)}
				/>
			)}
		</Stack>
	);
};

export default PositionInfo;
