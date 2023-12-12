import {
  Avatar,
  Box,
  Button,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
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
        <PopoverContent>
          <PopoverBody>
            <Button colorScheme="teal" onClick={handleLogout}>
              Logout
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </HStack>
  );
};
export default UserProfile;
