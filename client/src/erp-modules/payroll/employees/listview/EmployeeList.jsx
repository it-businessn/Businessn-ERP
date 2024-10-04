import { Avatar, HStack, IconButton, Tbody, Td, Tr } from "@chakra-ui/react";
import ActiveBadge from "components/ActiveBadge";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import useEmployees from "hooks/useEmployees";
import { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";

const EmployeeList = () => {
	const [isRefresh, setIsRefresh] = useState(false);
	const { company } = useCompany();
	const { employees, filteredEmployees, setFilteredEmployees } = useEmployees(
		isRefresh,
		company,
	);
	const empPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}`;
	const navigate = useNavigate();

	const handleClick = (id) => {
		navigate(`${empPath}/${id}/0`);
	};
	return (
		<TableLayout
			cols={["Employee Name", "Status", "Role", "Employee No", ""]}
			height="60vh"
			position="sticky"
			top={-1}
			zIndex="docked"
			textAlign="center"
		>
			<Tbody>
				{!employees?.length && <EmptyRowRecord />}
				{employees?.map(
					({ _id, fullName, payrollStatus, role, employeeNo }) => {
						return (
							<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<HStack>
										<Avatar name={fullName} size={"sm"} src="" boxSize="8" />
										<TextTitle size="sm" title={fullName} />
									</HStack>
								</Td>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									{payrollStatus?.includes("Active") && (
										<ActiveBadge title={"Payroll Activated"} />
									)}
								</Td>
								<Td p={0} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={role} />
								</Td>
								<Td py={0} borderBottomColor={"var(--filter_border_color)"}>
									<NormalTextTitle size="sm" title={employeeNo} />
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
