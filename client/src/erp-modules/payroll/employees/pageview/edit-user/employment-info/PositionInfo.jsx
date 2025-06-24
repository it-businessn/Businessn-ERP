import { Checkbox, FormLabel, Stack } from "@chakra-ui/react";

import { Flex, FormControl, Input, Select, SimpleGrid, Spinner } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { COMPANIES } from "constant";
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";

const PositionInfo = ({
	costCentres,
	position,
	handleUpdate,
	company,
	positionRoles,
	updateRecordIndex,
	payGroups,
	departments,
	setEditedIndices,
	editedIndices,
	lastBadgeId,
}) => {
	const [roleInfo, setRoleInfo] = useState(position);
	const [filteredDept, setFilteredDept] = useState(departments);
	const [autoGenerate, setAutoGenerate] = useState(false);

	useEffect(() => {
		if (company === COMPANIES.NW && departments && roleInfo.employmentCostCenter) {
			const selectedDepts = departments?.filter((_) =>
				_.name.includes(roleInfo.employmentCostCenter.slice(0, 4)),
			);
			setFilteredDept(selectedDepts);
		} else {
			setFilteredDept(departments);
		}
	}, [roleInfo.employmentCostCenter, departments]);

	useEffect(() => {
		if (autoGenerate) {
			const newID = String(lastBadgeId + 1).padStart(4, "0");
			setRoleInfo((prevData) => ({ ...prevData, timeManagementBadgeID: newID }));
			setEditedIndices((prev) => ({ ...prev, [updateRecordIndex]: true }));
		}
	}, [autoGenerate, lastBadgeId]);

	const handleChange = (index, e) => {
		const { name, value } = e.target;
		setRoleInfo((prevData) => ({ ...prevData, [name]: value }));
		setEditedIndices((prev) => ({ ...prev, [index]: true }));
	};

	return (
		<Stack spacing={4}>
			<SimpleGrid columns={4} spacing={3}>
				<FormControl isRequired>
					<FormLabel size="sm">Role Title</FormLabel>
					{positionRoles ? (
						<Select
							size="sm"
							value={roleInfo.title || ""}
							onChange={(e) => {
								setEditedIndices((prev) => ({ ...prev, [updateRecordIndex]: true }));
								setRoleInfo((prevData) => ({
									...prevData,
									title: e.target.value,
								}));
							}}
						>
							{positionRoles.map((role) => (
								<option key={role.name} value={role.name}>
									{role.name}
								</option>
							))}
						</Select>
					) : (
						<Flex align="center" justify="center" py={2}>
							<Spinner size="sm" mr={2} />
							<TextTitle size="sm" title="Loading job titles..." />
						</Flex>
					)}
				</FormControl>
				<FormControl>
					<FormLabel size="sm">Pay Group</FormLabel>
					{payGroups ? (
						<Select
							size="sm"
							value={roleInfo.employmentPayGroup || ""}
							onChange={(e) => {
								setEditedIndices((prev) => ({ ...prev, [updateRecordIndex]: true }));
								setRoleInfo((prevData) => ({
									...prevData,
									employmentPayGroup: e.target.value,
								}));
							}}
						>
							{payGroups.map((group) => (
								<option key={group.name} value={group.name}>
									{group.name}
								</option>
							))}
						</Select>
					) : (
						<Flex align="center" justify="center" py={2}>
							<Spinner size="sm" mr={2} />
							<TextTitle size="sm" title="Loading pay groups..." />
						</Flex>
					)}
				</FormControl>
				<FormControl isRequired>
					<FormLabel size="sm">Cost Center</FormLabel>
					{costCentres ? (
						<Select
							size="sm"
							value={roleInfo.employmentCostCenter || ""}
							onChange={(e) => {
								setEditedIndices((prev) => ({ ...prev, [updateRecordIndex]: true }));
								setRoleInfo((prevData) => ({
									...prevData,
									employmentCostCenter: e.target.value,
								}));
							}}
						>
							{costCentres.map((center) => (
								<option key={center.name} value={center.name}>
									{center.name}
								</option>
							))}
						</Select>
					) : (
						<Flex align="center" justify="center" py={2}>
							<Spinner size="sm" mr={2} />
							<TextTitle size="sm" title="Loading cost centers..." />
						</Flex>
					)}
				</FormControl>
				<FormControl isRequired>
					<FormLabel size="sm">Department</FormLabel>
					{filteredDept ? (
						<Select
							size="sm"
							value={roleInfo.employmentDepartment || ""}
							onChange={(e) => {
								setRoleInfo((prevData) => ({
									...prevData,
									employmentDepartment: e.target.value,
								}));
								setEditedIndices((prev) => ({ ...prev, [updateRecordIndex]: true }));
							}}
							placeholder="Select department"
						>
							{filteredDept?.map((dept) => (
								<option key={dept.name} value={dept.name}>
									{dept.name}
								</option>
							))}
						</Select>
					) : (
						<Flex align="center" justify="center" py={2}>
							<Spinner size="sm" mr={2} />
							<TextTitle size="sm" title="Loading departments..." />
						</Flex>
					)}
				</FormControl>
				<FormControl>
					<FormLabel size="sm">Time Management Badge ID</FormLabel>
					<Input
						size="sm"
						name="timeManagementBadgeID"
						value={roleInfo.timeManagementBadgeID || ""}
						onChange={(e) => handleChange(updateRecordIndex, e)}
						placeholder="Enter badge ID"
						mb={1}
					/>
					{!roleInfo.timeManagementBadgeID && (
						<Checkbox
							isChecked={autoGenerate}
							colorScheme="facebook"
							onChange={(e) => setAutoGenerate(e.target.checked)}
						>
							Auto-generate Badge ID
						</Checkbox>
					)}
				</FormControl>
				<FormControl>
					<FormLabel size="sm">Employee Card Number</FormLabel>
					<Input
						size="sm"
						name="employeeCardNumber"
						value={roleInfo.employeeCardNumber || ""}
						onChange={(e) => handleChange(updateRecordIndex, e)}
						placeholder="Enter card number"
					/>
				</FormControl>
			</SimpleGrid>
			<Stack w={"10%"} justifyContent={"end"}>
				{editedIndices[updateRecordIndex] && (
					<PrimaryButton
						bg="var(--banner_bg)"
						onOpen={() => handleUpdate(roleInfo, updateRecordIndex)}
						size="sm"
						borderRadius={6}
						name="Save"
						rightIcon={<FaSave />}
						w={"100px"}
					/>
				)}
			</Stack>
		</Stack>
	);
};

export default PositionInfo;
