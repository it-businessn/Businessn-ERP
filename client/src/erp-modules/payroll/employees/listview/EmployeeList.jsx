import { Avatar, HStack, IconButton, Tbody, Td, Tr } from "@chakra-ui/react";
import ActiveBadge from "components/ActiveBadge";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";

const EmployeeList = ({ employees }) => {
	const empPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}/info`;
	const navigate = useNavigate();

	const handleClick = (id) => {
		navigate(`${empPath}/${id}/0`);
	};
	const cols = [
		"Employee Name",
		"Department",
		// "Role",
		"Employee No",
		"Badge ID",
		"Status",
		"Action",
	];

	return (
		<TableLayout cols={cols} height="60vh" position="sticky" top={-1} zIndex={1} textAlign="center">
			<Tbody>
				{(!employees || employees?.length === 0) && (
					<EmptyRowRecord data={employees} colSpan={cols.length} />
				)}
				{employees?.map(
					({
						_id,
						fullName,
						payrollStatus,
						role,
						employeeNo,
						timeManagementBadgeID,
						department,
					}) => {
						return (
							<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
								<Td p={0} px={"2em"} borderBottomColor={"var(--filter_border_color)"}>
									<HStack spacing={4} cursor={"pointer"}>
										<Avatar name={fullName} size={"xs"} src="" boxSize="6" />
										<TextTitle
											mt={1}
											bg="var(--empName_bg)"
											color="var(--main_color)"
											borderRadius="6px"
											p="6px"
											size="sm"
											onClick={() => handleClick(_id)}
											title={fullName}
										/>
									</HStack>
								</Td>
								<Td p={0} px={"0.5em"} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={department[0]} />
								</Td>
								{/* <Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={role} />
								</Td> */}
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={employeeNo} />
								</Td>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={timeManagementBadgeID ?? ""} />
								</Td>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									{payrollStatus?.includes("Active") ? (
										<ActiveBadge title={"Payroll Activated"} />
									) : (
										payrollStatus
									)}
								</Td>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<IconButton
										size={"xs"}
										icon={<HiOutlineDotsHorizontal />}
										variant={"solid"}
										color={"var(--primary_button_bg)"}
										onClick={() => {
											handleClick(_id);
										}}
									/>
								</Td>
							</Tr>
						);
					},
				)}
			</Tbody>
		</TableLayout>
	);
};

export default EmployeeList;
