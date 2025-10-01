import {
	Box,
	Checkbox,
	Flex,
	Stack,
	Step,
	StepIcon,
	StepIndicator,
	StepNumber,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TextTitle from "components/ui/text/TextTitle";
import { tabPanelStyleCss, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";
const permissionList = [
	"Section Access",
	// "User Data",
	// "Group Data",
	// "Region Data",
	// "All Data",
	// "View",
	// "Edit",
	// "Delete",
];

const MasterUserModules = ({ formData, setFormData, modules }) => {
	const [permissions, setPermissions] = useState({});

	useEffect(() => {
		setFormData({
			...formData,
			moduleInfo: {
				...formData.moduleInfo,
				selectedPermissions: permissions,
			},
		});
	}, [permissions]);

	const togglePermission = (module, permission) => {
		setPermissions((prev) => {
			const newPermissions = { ...prev };
			if (!newPermissions[module]) {
				newPermissions[module] = {};
			}
			newPermissions[module][permission] = !newPermissions[module][permission];
			return newPermissions;
		});
	};

	return (
		<Flex height="100%">
			<Box
				display={{ base: "none", md: "flex" }}
				p={6}
				borderRight="1px solid"
				borderColor="gray.200"
				flex={0.2}
				bg="gray.50"
			>
				<Stepper index={0} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					<Step cursor="pointer" py={2}>
						<StepIndicator>
							<StepStatus
								complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
								incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
								active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
							/>
						</StepIndicator>
						<Box ml={3} whiteSpace="wrap">
							<StepTitle fontWeight={"bold"} mb={1}>
								Module Info
							</StepTitle>
						</Box>
						<StepSeparator />
					</Step>
				</Stepper>
			</Box>
			<Box flex={1} overflowY="auto" css={tabScrollCss}>
				<Stack spacing={3} p={5}>
					<TextTitle size="xl" title="Module Info" />
					<Stack>
						<Table variant="simple" w={"50%"}>
							<Thead>
								<Tr>
									<Th fontSize={"small"}>Module Name</Th>
									<Th textAlign="center" fontSize={"small"}>
										Enable Access
									</Th>
									{/* {permissionList.map((perm) => (
												<Th key={perm} textAlign="center">
													{perm}
												</Th>
											))} */}
								</Tr>
							</Thead>
							<Tbody>
								{(!modules || modules?.length === 0) && (
									<EmptyRowRecord data={modules} colSpan={2} />
								)}
								{modules?.map(({ name, _id }) => (
									<Tr key={_id}>
										<Td py={2}>{name}</Td>
										{permissionList.map((perm) => (
											<Td textAlign="center" py={2} key={perm}>
												<Checkbox
													colorScheme="facebook"
													isChecked={permissions[name]?.[perm] || false}
													onChange={() => togglePermission(name, perm)}
												/>
											</Td>
										))}
									</Tr>
								))}
							</Tbody>
						</Table>
					</Stack>
				</Stack>
			</Box>
		</Flex>
	);
};

export default MasterUserModules;
