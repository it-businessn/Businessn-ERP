import {
	Avatar,
	Box,
	Flex,
	HStack,
	IconButton,
	Tbody,
	Td,
	Text,
	Tr,
	useColorModeValue,
} from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import { COLS } from "constant";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { HiEye, HiPencil } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";

const Affiliates = ({ employees }) => {
	const empPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.AFFILIATE}/info`;
	const navigate = useNavigate();

	// Color mode values for better theming
	const hoverBg = useColorModeValue("gray.50", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const nameBoxBg = useColorModeValue("blue.50", "blue.900");
	const nameColor = useColorModeValue("blue.600", "blue.200");

	const handleClick = (id) => {
		navigate(`${empPath}/${id}/0`);
	};

	const cols = [COLS.EMP_NAME, "Department", "Role", "Employee No", "Badge ID", "Status", "Action"];

	const StatusBadge = ({ status }) => {
		let props = {
			px: 3,
			py: 1,
			borderRadius: "full",
			fontSize: "sm",
			fontWeight: "medium",
		};

		if (status?.includes("Active")) {
			return (
				<Text {...props} bg="green.100" color="green.700">
					Active
				</Text>
			);
		} else if (status?.includes("Terminated")) {
			return (
				<Text {...props} bg="red.100" color="red.700">
					Terminated
				</Text>
			);
		}
		return (
			<Text {...props} bg="gray.100" color="gray.700">
				{status}
			</Text>
		);
	};

	return (
		<TableLayout
			cols={cols}
			css={tabScrollCss}
			height="calc(100vh - 470px)"
			position="sticky"
			top={-1}
			zIndex={1}
			textAlign="left"
		>
			<Tbody>
				{(!employees || employees?.length === 0) && (
					<Tr>
						<Td colSpan={cols.length}>
							<Flex direction="column" align="center" justify="center" py={10} color="gray.500">
								<Box fontSize="xl" mb={2}>
									No affiliates found
								</Box>
								<Text fontSize="sm">Add member to see them listed here</Text>
							</Flex>
						</Td>
					</Tr>
				)}
				{employees?.map(
					({
						_id,
						firstName,
						lastName,
						middleName,
						empId,
						payrollStatus,
						employmentRole,
						employeeNo,
						positions,
					}) => {
						const fullName = `${firstName} ${middleName || ""} ${lastName}`;
						return (
							<Tr
								key={_id}
								_hover={{ bg: hoverBg }}
								transition="all 0.2s"
								cursor="pointer"
								onClick={() => handleClick(empId)}
							>
								<Td py={0} borderBottomColor={borderColor}>
									<HStack spacing={4}>
										<Avatar
											name={fullName}
											size={"sm"}
											src={null}
											borderRadius="lg"
											bg={nameBoxBg}
											color={nameColor}
										/>
										<Box>
											<Text fontWeight="medium" fontSize="sm" color={nameColor}>
												{fullName}
											</Text>
											<Text fontSize="xs" color="gray.500">
												{positions?.[0]?.employmentDepartment || ""}
											</Text>
										</Box>
									</HStack>
								</Td>
								<Td py={0} borderBottomColor={borderColor}>
									<Text fontSize="sm">{positions?.[0]?.employmentDepartment || ""}</Text>
								</Td>
								<Td py={0} borderBottomColor={borderColor}>
									<Text fontSize="sm">{employmentRole}</Text>
								</Td>
								<Td py={0} borderBottomColor={borderColor}>
									<Text fontSize="sm" fontFamily="mono">
										{employeeNo}
									</Text>
								</Td>
								<Td py={0} borderBottomColor={borderColor}>
									<Text fontSize="sm" fontFamily="mono">
										{positions?.[0]?.timeManagementBadgeID || "-"}
									</Text>
								</Td>
								<Td py={0} borderBottomColor={borderColor}>
									<StatusBadge status={payrollStatus} />
								</Td>
								<Td borderBottomColor={borderColor}>
									<HStack spacing={2}>
										<IconButton
											size="sm"
											icon={<HiEye />}
											variant="ghost"
											colorScheme="blue"
											aria-label="View details"
											onClick={(e) => {
												e.stopPropagation();
												handleClick(empId._id);
											}}
										/>
										<IconButton
											size="sm"
											icon={<HiPencil />}
											variant="ghost"
											colorScheme="blue"
											aria-label="Edit employee"
											onClick={(e) => {
												e.stopPropagation();
												handleClick(empId._id);
											}}
										/>
									</HStack>
								</Td>
							</Tr>
						);
					},
				)}
			</Tbody>
		</TableLayout>
	);
};

export default Affiliates;
