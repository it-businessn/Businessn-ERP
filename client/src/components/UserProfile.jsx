import {
  Avatar,
  Box,
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";
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
    <HStack color="#fff" pb={2}>
      <Popover>
        <Avatar name={user.fullName} src="" boxSize="12" />
        <PopoverTrigger>
          <Box cursor="pointer">
            <Text fontWeight="medium" fontSize="sm" textTransform="capitalize">
              {user.fullName}
            </Text>
            <Text color="muted" fontSize="sm">
              {user.email}
            </Text>
          </Box>
        </PopoverTrigger>
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
