import { Button, FormLabel, HStack, Stack } from "@chakra-ui/react";

import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { COMPANIES } from "constant";
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
	company,
}) => {
	const defaultRoleInfo = {
		title: "",
		employmentPayGroup: "",
		employmentCostCenter: "",
		employmentDepartment: "",
		timeManagementBadgeID: "",
		cardNum: "",
		positions: [],
	};

	const [roleInfo, setRoleInfo] = useState(currentRoleInfo || defaultRoleInfo);
	const [filteredDept, setFilteredDept] = useState(department);

	useEffect(() => {
		if (
			roleInfo.title &&
			roleInfo.employmentCostCenter &&
			roleInfo.employmentPayGroup &&
			roleInfo.employmentDepartment
		) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [
		roleInfo.title,
		roleInfo.employmentCostCenter,
		roleInfo.employmentPayGroup,
		roleInfo.employmentDepartment,
	]);

	useEffect(() => {
		if (company === COMPANIES.NW && department && roleInfo.employmentCostCenter) {
			const selectedDepts = department?.filter((_) =>
				_.name.includes(roleInfo.employmentCostCenter.slice(0, 4)),
			);
			setFilteredDept(selectedDepts);
		} else {
			setFilteredDept(department);
		}
	}, [roleInfo.employmentCostCenter, department]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRoleInfo((prevData) => ({ ...prevData, [name]: value }));
	};

	return (
		<Stack>
			<Stack>
				{rolePos ? <TextTitle title={rolePos} /> : <FormLabel>New Role Details</FormLabel>}
				<HStack alignItems="self-start" spacing={5} w="70%">
					<Stack>
						<InputFormControl
							autoComplete="off"
							required={(isOpen || !roleInfo.title) && true}
							label="Role title"
							name="title"
							placeholder="Enter title"
							valueText={roleInfo.title}
							handleChange={handleChange}
						/>

						{/* {isOpen ? ( */}
						<>
							<InputFormControl
								autoComplete="off"
								label="Time Management Badge ID"
								name="timeManagementBadgeID"
								placeholder="Enter new Badge ID"
								valueText={roleInfo.timeManagementBadgeID}
								handleChange={handleChange}
								type="number"
							/>
							<InputFormControl
								autoComplete="off"
								label="Employee Card Number"
								name="cardNum"
								placeholder="Enter Card Number"
								valueText={roleInfo.cardNum}
								handleChange={handleChange}
							/>
						</>
						{/* // ) : (
						// 	<Stack>
						// 		<FormLabel>Linked Time Management Badge ID</FormLabel>
						// 		<NormalTextTitle title={roleInfo.timeManagementBadgeID || "NA"} />
						// 		<FormLabel>Employee Card Number</FormLabel>
						// 		<NormalTextTitle title={roleInfo.cardNum || "NA"} />
						// 	</Stack>
						// )} */}
					</Stack>
					<Stack>
						<SelectFormControl
							required={(isOpen || !roleInfo.employmentPayGroup) && true}
							valueParam="name"
							name="employmentPayGroup"
							label="Pay Group"
							valueText={roleInfo.employmentPayGroup || ""}
							handleChange={handleChange}
							options={payGroups}
							placeholder="Select Pay Group"
						/>

						<SelectFormControl
							required={(isOpen || !roleInfo.employmentCostCenter) && true}
							valueParam="name"
							name="employmentCostCenter"
							label="Cost Center"
							valueText={roleInfo.employmentCostCenter || ""}
							handleChange={handleChange}
							options={costCentres}
							placeholder="Select Cost Center"
						/>
						<SelectFormControl
							required={(isOpen || !roleInfo.employmentDepartment) && true}
							valueParam="name"
							name="employmentDepartment"
							label="Department"
							valueText={roleInfo.employmentDepartment || ""}
							handleChange={handleChange}
							options={filteredDept}
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
					name="Save"
					isDisabled={
						!roleInfo.employmentCostCenter ||
						!roleInfo.employmentPayGroup ||
						!roleInfo.employmentDepartment
					}
					onOpen={() => {
						if (roleInfo.title) {
							handleSubmit(roleInfo);
						}
					}}
				/>
			)}
		</Stack>
	);
};

export default PositionInfo;
