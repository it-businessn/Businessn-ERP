import {
	Box,
	HStack,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Stack,
	Text,
} from "@chakra-ui/react";
import { DashboardLayout, ProfileContainer } from "layouts";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import * as api from "services";
import { useBreakpointValue } from "services/Breakpoint";
import { loggedInUser } from "utils/common";
import { MemberTable } from "./MemberTable";

export default function User() {
	const [employees, setEmployees] = useState(null);
	const { isMobile } = useBreakpointValue();
	const [isUpdated, setIsUpdated] = useState(false);
	useEffect(() => {
		fetchUserData();
	}, [isUpdated]);

	const fetchUserData = async () => {
		try {
			let result = await api.getAllUsers(loggedInUser.token);
			const response = result.data;
			response.map((user) => {
				let middleName = !user?.middleName ? "" : user.middleName;
				user.name = `${user.firstName} ${middleName} ${user.lastName}`;
				return user;
			});
			setEmployees(response);
		} catch (error) {}
	};
	const refreshData = (value) => setIsUpdated(value);
	return (
		<DashboardLayout>
			<ProfileContainer>
				{/* <Stack spacing="3">
                    <UserList employees={employees} />
                </Stack> */}
				<Box
					boxShadow={{
						base: "none",
						md: "sm",
					}}
					borderRadius={{
						base: "none",
						md: "lg",
					}}
				>
					<Stack>
						<Box
							px={{
								base: "4",
								md: "6",
							}}
							pt="5"
						>
							<Stack
								direction={{
									base: "column",
									md: "row",
								}}
								justify="space-between"
							>
								<Text fontWeight="medium">Employees</Text>
								<InputGroup maxW="xs">
									<InputLeftElement pointerEvents="none">
										<Icon as={FiSearch} color="muted" boxSize="5" />
									</InputLeftElement>
									<Input placeholder="Search" />
								</InputGroup>
							</Stack>
						</Box>
						<Box>
							{employees && (
								<MemberTable
									update={refreshData}
									isEditable
									employees={employees}
								/>
							)}
						</Box>
						<Box
							px={{
								base: "4",
								md: "6",
							}}
							pb="5"
						>
							<HStack spacing="3" justify="space-between">
								{!isMobile && employees && (
									<Text color="muted" fontSize="sm">
										Showing 1 to {employees.length} of {employees.length}{" "}
										records
									</Text>
								)}
								{/* <ButtonGroup
                  spacing="3"
                  justifyContent="space-between"
                  width={{
                    base: "full",
                    md: "auto",
                  }}
                  variant="secondary"
                >
                  <Button>Previous</Button>
                  <Button>Next</Button>
                </ButtonGroup> */}
							</HStack>
						</Box>
					</Stack>
				</Box>
			</ProfileContainer>
		</DashboardLayout>
	);
}
