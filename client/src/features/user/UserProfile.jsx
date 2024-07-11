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
	VStack,
} from "@chakra-ui/react";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";

const UserProfile = ({ user, handleLogout }) => {
	const navigate = useNavigate();

	const [signUp, setSignUp] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

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
				<IconButton
					aria-label="Notification Bell"
					icon={<FontAwesomeIcon icon={faBell} />}
					borderRadius="full"
					color="var(--main_color_black)"
					bg={"var(--main_color)"}
					boxShadow="md"
					_hover={{ bg: "var(--primary_bg)" }}
				/>
				<PopoverTrigger>
					<Avatar
						onClick={handleToggle}
						name={user.fullName}
						src=""
						boxSize="12"
					/>
				</PopoverTrigger>
				{/* <Box cursor="pointer">
          <Text fontWeight="medium" fontSize="sm" textTransform="capitalize">
            {user.fullName}
          </Text>
          <Text color="muted" fontSize="sm">
            {user.email}
          </Text>
        </Box> */}
				<PopoverContent maxW="xs" w="12rem" border="none">
					<PopoverArrow />

					<PopoverBody>
						<VStack w="100%" alignItems="start">
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
