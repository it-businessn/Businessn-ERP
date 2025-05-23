import { Button, FormLabel, HStack, Stack, Tooltip } from "@chakra-ui/react";

import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { COMPANIES } from "constant";
import AddNewShiftRole from "erp-modules/scheduling/workview/quick-selection/AddNewShiftRole";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

const PositionInfo = ({
	isOpen,
	setIsOpen,
	isDisabled,
	setIsDisabled,
	selectedPayGroup,
	department,
	costCentres,
	currentRoleInfo,
	handleSubmit,
	rolePos,
	company,
	positionRoles,
	setPositionAdded,
	updateRecordIndex,
}) => {
	const defaultRoleInfo = {
		title: "",
		employmentPayGroup: selectedPayGroup,
		employmentCostCenter: "",
		employmentDepartment: "",
		timeManagementBadgeID: "",
		cardNum: "",
		positions: [],
	};
	const [showAddNewRole, setShowAddNewRole] = useState(false);
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

	useEffect(() => {
		if (selectedPayGroup && roleInfo?.employmentPayGroup !== selectedPayGroup) {
			setRoleInfo((prevData) => ({ ...prevData, employmentPayGroup: selectedPayGroup }));
		}
	}, [roleInfo.employmentPayGroup, selectedPayGroup]);

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
						<HStack w="100%" justify={"space-between"}>
							<SelectFormControl
								valueParam="name"
								required={true}
								name="name"
								label="Role title"
								valueText={roleInfo.title || ""}
								handleChange={(e) =>
									setRoleInfo((prevData) => ({
										...prevData,
										title: e.target.value,
									}))
								}
								options={positionRoles}
								placeholder="Select Role"
							/>
							<Tooltip label="Add new role">
								<span style={{ marginTop: "1em" }}>
									<FaPlus cursor="pointer" onClick={() => setShowAddNewRole(true)} />
								</span>
							</Tooltip>
						</HStack>
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
						<InputFormControl
							readOnly
							autoComplete="off"
							label="Pay Group"
							name="employmentPayGroup"
							valueText={roleInfo?.employmentPayGroup}
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
			{showAddNewRole && (
				<AddNewShiftRole
					showAddNewRole={showAddNewRole}
					setRefresh={setPositionAdded}
					setShowAddNewRole={setShowAddNewRole}
					company={company}
				/>
			)}
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
							handleSubmit(roleInfo, updateRecordIndex);
						}
					}}
				/>
			)}
		</Stack>
	);
};

export default PositionInfo;
