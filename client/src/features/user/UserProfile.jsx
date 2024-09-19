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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";
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
		navigate(`${ROUTE_PATH.SALES}${ROUTE_PATH.PROFILE}`);
	};

	const showRegisterPage = () => {
		setSignUp(true);
	};

	return (
		<HStack pb={2} _hover={{ cursor: "pointer" }}>
			<Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<PopoverTrigger>
					<Avatar
						onClick={handleToggle}
						name={user?.fullName}
						src=""
						boxSize="12"
					/>
				</PopoverTrigger>
				<PopoverContent maxW="xs" w="12rem" border="none">
					<PopoverArrow />

					<PopoverBody>
						<VStack w="100%" alignItems="start" color="var(--logo_bg)">
							<Button variant="ghost" onClick={showProfilePage}>
								Profile
							</Button>
							{user?.role === "Administrator" && (
								<Button variant="ghost" onClick={showRegisterPage}>
									Create Account
								</Button>
							)}
							<Button variant="ghost" onClick={handleLogout}>
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
