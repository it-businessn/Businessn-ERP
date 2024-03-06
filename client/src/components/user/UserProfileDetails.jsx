import {
	Box,
	Button,
	Card,
	Divider,
	HStack,
	Icon,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaAddressCard, FaUndoAlt } from "react-icons/fa";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import { toCapitalize } from "utils";
import ChangePassword from "./ChangePassword";
import EditUserInfo from "./EditUserInfo";

const UserProfileDetails = () => {
	const [userData, setUserData] = useState(LocalStorageService.getItem("user"));
	const { isMobile } = useBreakpointValue();
	const [editMode, setEditMode] = useState(false);

	const [changePasswordMode, setPasswordMode] = useState(false);
	const [error, setError] = useState(null);

	// useEffect(() => {console.log()
	// 	LocalStorageService.setItem("user", userData);
	// }, [userData]);

	const handleEditClick = () => {
		setEditMode(true);
		setPasswordMode(false);
	};

	const handlePasswordClick = () => {
		setEditMode(false);
		setPasswordMode(true);
	};

	const handleReset = () => {
		setEditMode(false);
		setPasswordMode(false);
	};

	return (
		<HStack
			flexDir={{ base: "column", md: "row" }}
			borderRadius="10px"
			border="3px solid white"
			m="1em"
		>
			<Card flex={1} m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
				<Box
					fontWeight="bold"
					p="1em"
					bg={"#dbe5ff"}
					borderTopLeftRadius="10px"
					borderTopRightRadius="10px"
				>
					<VStack alignItems="self-start" spacing={5}>
						<Icon as={FaAddressCard} boxSize={10} />
						<Text fontSize="xl" fontWeight="bold">
							{userData.fullName}
						</Text>
						<Text mr="3">{userData.email}</Text>
					</VStack>
				</Box>
				<VStack align="flex-start" color={"brand.200"} p={"1em"}>
					<Text fontWeight="bold">Phone Number</Text>
					<Text fontWeight="bold" color={"brand.600"}>
						{userData.phoneNumber}
					</Text>

					<Text fontWeight="bold">Role</Text>
					<Text fontWeight="bold" color={"brand.600"}>
						{toCapitalize(userData.role)}
					</Text>
					<Text fontWeight="bold">Department</Text>
					<Text fontWeight="bold" color={"brand.600"}>
						{toCapitalize(userData.department)}
					</Text>
				</VStack>
				<HStack p={"1em"}>
					<Button
						bg="brand.logo_bg"
						// isLoading={isLoading}
						isDisabled={editMode}
						onClick={handleEditClick}
						type="submit"
					>
						Edit
					</Button>
					<Button
						bg="brand.logo_bg"
						ml={2}
						isDisabled={changePasswordMode}
						onClick={handlePasswordClick}
					>
						Change Password
					</Button>
					<Button
						bg="#dbe5ff"
						color={"brand.logo_bg"}
						ml={2}
						onClick={handleReset}
					>
						<FaUndoAlt />
					</Button>
				</HStack>
			</Card>
			{editMode && (
				<>
					{!isMobile && (
						<Divider
							orientation="vertical"
							height="600px"
							borderWidth="1px"
							borderColor="gray.200"
						/>
					)}
					<EditUserInfo
						setEditMode={setEditMode}
						userData={userData}
						setUserData={setUserData}
						setError={setError}
						error={error}
					/>
				</>
			)}
			{changePasswordMode && (
				<>
					{!isMobile && (
						<Divider
							orientation="vertical"
							height="600px"
							borderWidth="1px"
							borderColor="gray.200"
						/>
					)}
					<ChangePassword
						setPasswordMode={setPasswordMode}
						userData={userData}
						setUserData={setUserData}
						setError={setError}
						error={error}
					/>
				</>
			)}
		</HStack>
	);
};

export default UserProfileDetails;