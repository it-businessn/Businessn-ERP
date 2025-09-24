import {
	Box,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
	SimpleGrid,
	Spinner,
	Stack,
	Tooltip,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import { COMPANIES } from "constant";
import AddNewShiftRole from "erp-modules/scheduling/workview/quick-selection/AddNewShiftRole";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

const NewPositionModal = ({
	positionRoles,
	onClose,
	handleUpdate,
	payGroups,
	costCentres,
	departments,
	selectedPayGroup,
	company,
	setNewRoleAdded,
	lastBadgeId,
}) => {
	const [autoGenerate, setAutoGenerate] = useState(false);
	const defaultRoleInfo = {
		title: "",
		employmentPayGroup: selectedPayGroup,
		employmentCostCenter: "",
		employmentDepartment: "",
		timeManagementBadgeID: "",
		cardNum: "",
	};
	const [filteredDept, setFilteredDept] = useState(departments);
	const [roleInfo, setRoleInfo] = useState(defaultRoleInfo);
	const [showAddNewRole, setShowAddNewRole] = useState(false);

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
		}
	}, [autoGenerate, lastBadgeId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRoleInfo((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleUpdate(roleInfo);
	};
	return (
		<Box p={5} w={"60%"}>
			<BoxCard border="1px solid var(--lead_cards_border)">
				<HStack justify={"start"}>
					<TextTitle size="lg" title="New Role Details" />
					<PrimaryButton size="sm" name="Add Role Title" onOpen={() => setShowAddNewRole(true)} />
				</HStack>
				<form onSubmit={handleSubmit}>
					<Stack spacing={4}>
						<SimpleGrid columns={2} spacing={6}>
							<HStack w="100%" justify={"space-between"}>
								<FormControl isRequired>
									<FormLabel size="sm">Role Title</FormLabel>
									{positionRoles ? (
										<Select
											size="sm"
											value={roleInfo?.title}
											onChange={(e) => {
												if (e.target.value) {
													setRoleInfo((prevData) => ({
														...prevData,
														title: e.target.value,
													}));
												}
											}}
											placeholder="Select title"
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
								<Tooltip label="Add new role">
									<span style={{ marginTop: "1em" }}>
										<FaPlus cursor="pointer" onClick={() => setShowAddNewRole(true)} />
									</span>
								</Tooltip>
							</HStack>
							<FormControl>
								<FormLabel size="sm">Pay Group</FormLabel>
								{payGroups ? (
									<Select
										size="sm"
										value={roleInfo?.employmentPayGroup}
										onChange={(e) => {
											if (e.target.value) {
												setRoleInfo((prevData) => ({
													...prevData,
													employmentPayGroup: e.target.value,
												}));
											}
										}}
										placeholder="Select paygroup"
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
										value={roleInfo?.employmentCostCenter}
										onChange={(e) => {
											if (e.target.value) {
												setRoleInfo((prevData) => ({
													...prevData,
													employmentCostCenter: e.target.value,
												}));
											}
										}}
										placeholder="Select cost center"
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
										value={roleInfo?.employmentDepartment}
										onChange={(e) => {
											if (e.target.value) {
												setRoleInfo((prevData) => ({
													...prevData,
													employmentDepartment: e.target.value,
												}));
											}
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
									value={roleInfo?.timeManagementBadgeID}
									onChange={handleChange}
									placeholder="Enter badge ID"
									isDisabled={autoGenerate}
									mb={1}
								/>
								<Checkbox
									isChecked={autoGenerate}
									colorScheme="facebook"
									onChange={(e) => setAutoGenerate(e.target.checked)}
								>
									Auto-generate Badge ID
								</Checkbox>
							</FormControl>
							<FormControl>
								<FormLabel size="sm">Employee Card Number</FormLabel>
								<Input
									size="sm"
									name="employeeCardNumber"
									value={roleInfo?.employeeCardNumber}
									onChange={handleChange}
									placeholder="Enter card number"
								/>
							</FormControl>
						</SimpleGrid>
						<ActionButtonGroup
							size="sm"
							bg="var(--banner_bg)"
							submitBtnName={"Add"}
							isDisabled={
								!roleInfo?.title ||
								!roleInfo.employmentCostCenter ||
								!roleInfo.employmentDepartment ||
								!roleInfo?.employmentPayGroup
							}
							onClose={onClose}
						/>
					</Stack>
				</form>
				{showAddNewRole && (
					<AddNewShiftRole
						showAddNewRole={showAddNewRole}
						setRefresh={setNewRoleAdded}
						setShowAddNewRole={setShowAddNewRole}
						company={company}
					/>
				)}
			</BoxCard>
		</Box>
	);
};
export default NewPositionModal;
