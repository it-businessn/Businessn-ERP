// import { MoonIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Button,
	HStack,
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
import { useNavigate } from "react-router-dom";
import { adminConsolePath, userProfilePath } from "routes";
// import { styleConsole } from "utils";

const UserProfile = ({ user, handleLogout }) => {
	const navigate = useNavigate();

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
		{ name: "Profile", handleClick: showProfilePage },
		{ name: "Admin console", handleClick: showConfigPage },
	];

	return (
		<HStack pb={2} _hover={{ cursor: "pointer" }}>
			<Popover isOpen={isOpen} onClose={handleToggle}>
				<PopoverTrigger>
					<Avatar
						onClick={handleToggle}
						name={user?.fullName}
						src=""
						boxSize="12"
						borderRadius="10%"
					/>
				</PopoverTrigger>
				<PopoverContent maxW="xs" w="12rem" border="none" position="sticky" zIndex={5}>
					<PopoverArrow />

					<PopoverBody>
						<VStack w="100%" alignItems="start" color="var(--logo_bg)">
							{user?.role === ROLES.SHADOW_ADMIN &&
								MENU_OPTIONS.map(({ name, handleClick }) => (
									<Button key={name} variant="ghost" onClick={handleClick}>
										{name}
									</Button>
								))}
							{/* {user?.role === "Administrator" && (
								<Button variant="ghost" onClick={showRegisterPage}>
									Create Account
								</Button>
							)} */}
							<Button
								variant="ghost"
								onClick={() => {
									navigate("/login");
									handleLogout();
								}}
							>
								Logout
							</Button>
						</VStack>
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</HStack>
	);
};
export default UserProfile;
