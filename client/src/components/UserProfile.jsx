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

const UserProfile = ({ user, handleLogout }) => {
  const navigate = useNavigate();
  const [signUp, setSignUp] = useState(false);

  useEffect(() => {
    if (signUp) {
      navigate("/signup");
    }
  }, [signUp]);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAccountClick = () => {
    setSignUp(true);
  };

  return (
    <HStack pb={2} _hover={{ cursor: "pointer" }}>
      <Popover>
        <IconButton
          aria-label="Notification Bell"
          icon={<FontAwesomeIcon icon={faBell} />}
          borderRadius="full"
          color="brand.600"
          bg={"brand.100"}
          boxShadow="md"
          _hover={{ bg: "brand.icon_hover" }}
        />
        <PopoverTrigger>
          <Avatar name={user.fullName} src="" boxSize="12" />
        </PopoverTrigger>
        {/* <Box cursor="pointer">
          <Text fontWeight="medium" fontSize="sm" textTransform="capitalize">
            {user.fullName}
          </Text>
          <Text color="muted" fontSize="sm">
            {user.email}
          </Text>
        </Box> */}
        <PopoverContent maxW="xs" w="12rem">
          <PopoverArrow />

          <PopoverBody>
            <VStack w="100%" alignItems="start">
              <Button variant="ghost" onClick={handleProfileClick}>
                Profile
              </Button>
              {user?.role === "Administrator" && (
                <Button variant="ghost" onClick={handleAccountClick}>
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
