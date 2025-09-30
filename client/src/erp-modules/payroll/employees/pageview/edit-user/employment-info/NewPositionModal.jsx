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
} from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import { RoleInfoControl } from "erp-modules/payroll/controls/RoleInfoControl";
import { useEffect, useState } from "react";

const NewPositionModal = ({
	onClose,
	handleUpdate,
	payGroups,
	costCentres,
	selectedPayGroup,
	company,
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
	const [filteredDept, setFilteredDept] = useState(null);
	const [roleInfo, setRoleInfo] = useState(defaultRoleInfo);

	useEffect(() => {
		if (roleInfo.employmentCostCenter) {
			const selectedDepts = costCentres?.find((_) =>
				_.name.includes(roleInfo.employmentCostCenter),
			)?.departments;
			setFilteredDept(selectedDepts);
		}
	}, [roleInfo.employmentCostCenter]);

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
					{/* <PrimaryButton size="sm" name="Add Role Title" onOpen={() => setShowAddNewRole(true)} /> */}
				</HStack>
				<form onSubmit={handleSubmit}>
					<Stack spacing={4}>
						<SimpleGrid columns={2} spacing={6}>
							<RoleInfoControl
								company={company}
								title={roleInfo?.title}
								handleChange={(e) => {
									if (e.target.value) {
										setRoleInfo((prevData) => ({
											...prevData,
											title: e.target.value,
										}));
									}
								}}
							/>
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
								<Select
									disabled={filteredDept ? false : true}
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
			</BoxCard>
		</Box>
	);
};
export default NewPositionModal;
