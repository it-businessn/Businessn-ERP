// import { MoonIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Button,
	HStack,
	IconButton,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	useColorMode,
	VStack,
} from "@chakra-ui/react";
import { ROLES } from "constant";
import { useEffect, useState } from "react";
import { IoMdHelpCircle } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { adminConsolePath, userProfilePath } from "routes";
import { isManager } from "utils";
// import { styleConsole } from "utils";

const UserProfile = ({ user, handleLogout }) => {
	const navigate = useNavigate();
	const hasConsoleAccess = isManager(user?.role) && user?.role !== ROLES.MANAGER;
	const [signUp, setSignUp] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const { colorMode, toggleColorMode } = useColorMode();

	// const toggleTheme = () => {
	// 	toggleColorMode();
	// 	styleConsole(colorMode === "light" ? "Dark" : "Light");
	// };

	useEffect(() => {
		if (signUp) {
			navigate("/signup");
		}
	}, [signUp]);

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const showProfilePage = () => {
		handleToggle();
		navigate(userProfilePath);
	};

	const showConfigPage = () => {
		handleToggle();
		navigate(adminConsolePath);
	};

	const showRegisterPage = () => {
		setSignUp(true);
	};

	const MENU_OPTIONS = [
		{ name: "Profile", handleClick: showProfilePage, hasAccess: true },
		{
			name: "Admin console",
			handleClick: showConfigPage,
			hasAccess: hasConsoleAccess,
		},
	];

	return (
		<HStack spacing={2}>
			<Popover isOpen={isOpen} onClose={handleToggle}>
				<PopoverTrigger>
					<Avatar
						_hover={{ cursor: "pointer" }}
						onClick={handleToggle}
						name={user?.fullName}
						src={null}
						boxSize="12"
						borderRadius="50%"
					/>
				</PopoverTrigger>
				<PopoverContent maxW="xs" w="12rem" border="none" position="sticky" zIndex={5}>
					<PopoverArrow />

					<PopoverBody>
						<VStack w="100%" alignItems="start" color="var(--logo_bg)">
							{MENU_OPTIONS.map(
								({ name, handleClick, hasAccess }) =>
									hasAccess && (
										<Button key={name} variant="ghost" onClick={handleClick}>
											{name}
										</Button>
									),
							)}
							{/* {user?.role === "Administrator" && (
								<Button variant="ghost" onClick={showRegisterPage}>
									Create Account
								</Button>
							)} */}
							<Button
								variant="ghost"
								onClick={() => {
									handleLogout();
								}}
							>
								Logout
							</Button>
						</VStack>
					</PopoverBody>
				</PopoverContent>
			</Popover>
			<IconButton
				icon={<IoMdHelpCircle style={{ width: "25px", height: "25px" }} />}
				onClick={() => navigate("/support")}
				aria-label="Support"
			/>
			{hasConsoleAccess && (
				<IconButton
					icon={<IoSettingsOutline style={{ width: "24px", height: "24px" }} />}
					onClick={() => navigate(adminConsolePath)}
					aria-label="Admin"
				/>
			)}
		</HStack>
	);
};
export default UserProfile;
