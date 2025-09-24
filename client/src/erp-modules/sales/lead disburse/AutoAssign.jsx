import { Box, Flex, FormLabel, HStack, Input, Radio, Select, Spacer, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import SettingService from "services/SettingService";

const AutoAssign = () => {
	const MINUTES = Array.from({ length: 30 }, (_, index) => index + 5);
	const defaultConfig = {
		isIdleLeadReassignment: "Disable",
		idleTimeHours: 0,
		idleTimeMinutes: 0,
		AssignLeadTo: false,
	};
	const [setUpConfigData, setSetUpConfigData] = useState(defaultConfig);
	const [setUpId, setSetUpId] = useState(null);

	const isDisabled = setUpConfigData?.isIdleLeadReassignment === "Disable";

	useEffect(() => {
		const fetchSetUpConfig = async () => {
			try {
				const { data } = await SettingService.getIdleLeadReAssignment();
				if (data.length > 0) {
					const { isIdleLeadReassignment, idleTimeHours, idleTimeMinutes, AssignLeadTo } = data[0];

					setSetUpConfigData((prevData) => ({
						...prevData,
						isIdleLeadReassignment,
						idleTimeHours,
						idleTimeMinutes,
						AssignLeadTo,
					}));

					setSetUpId(data[0]?._id);
				}
			} catch (error) {}
		};
		fetchSetUpConfig();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (value) {
			setSetUpConfigData((prevData) => ({
				...prevData,
				[name]: value,
			}));

			setSetUpConfigData((prevData) => ({
				...prevData,
				AssignLeadTo: setUpConfigData.isIdleLeadReassignment === "Disable",
			}));
		}
		handleSubmit();
	};
	const handleSubmit = async () => {
		try {
			if (setUpId) {
				await SettingService.updateSetUpIdleLeadReAssignment(setUpConfigData, setUpId);
			} else {
				await SettingService.setUpIdleLeadReAssignment(setUpConfigData, setUpId);
			}
		} catch (error) {}
	};

	return (
		<Flex gap={{ base: 5, lg: 15, xl: 20 }} my={"1em"} flexDir={{ base: "column", lg: "row" }}>
			{!setUpConfigData && <></>}
			{setUpConfigData && (
				<>
					<Box flex={0.8}>
						<FormLabel color={"var(--nav_color)"}>Idle Lead Reassignment</FormLabel>
						<HStack>
							<Text fontSize={"sm"} fontWeight={"bold"}>
								Status:
							</Text>
							<Select
								icon={<FaCaretDown />}
								borderRadius="10px"
								size="sm"
								name="isIdleLeadReassignment"
								onChange={handleChange}
								value={setUpConfigData?.isIdleLeadReassignment}
							>
								<option value={"Disable"}>Disable</option>
								<option value={"Enable"}>Enable</option>
							</Select>
						</HStack>
					</Box>
					<Box flex={1}>
						<FormLabel color={"var(--nav_color)"}>Idle Determine At:</FormLabel>
						<HStack>
							<Input
								isDisabled={isDisabled}
								type="text"
								name="idleTimeHours"
								value={setUpConfigData?.idleTimeHours}
								fontSize="sm"
								size={"sm"}
								onChange={handleChange}
								required
							/>
							<Text fontSize={"sm"} fontWeight={"bold"}>
								Hours
							</Text>
							<Select
								isDisabled={isDisabled}
								icon={<FaCaretDown />}
								borderRadius="10px"
								size="sm"
								name="idleTimeMinutes"
								onChange={handleChange}
								value={setUpConfigData?.idleTimeMinutes}
							>
								{MINUTES.map((_) => (
									<option value={_} key={_}>
										{_}
									</option>
								))}
							</Select>
							<Text fontSize={"sm"} fontWeight={"bold"}>
								Minutes
							</Text>
						</HStack>
					</Box>
					<Box flex={0.8}>
						<FormLabel color={"var(--nav_color)"}>Assign Lead to</FormLabel>
						<Radio
							name="AssignLeadTo"
							isChecked={setUpConfigData?.AssignLeadTo}
							mt={"5px"}
							isDisabled={isDisabled}
						>
							<Text fontSize={"sm"} fontWeight={"bold"}>
								Next Available User
							</Text>
						</Radio>
					</Box>
					<Spacer />
				</>
			)}
		</Flex>
	);
};

export default AutoAssign;
