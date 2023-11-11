import { Icon } from "@chakra-ui/icons";
import {
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import { NavButton, UserProfile } from "components";
import { ROUTE_PATH, USER_ROLE, getSideMenu } from "config/constant";
import { useAuthContext } from "hooks/useAuthContext";
import { useState } from "react";
import { FiLogOut, FiPenTool, FiSearch, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as api from "services";
import Logo from "../../components/logo";
import Menu from "./Menu";
import "./Sidebar.css";
import { BsFillCalculatorFill } from "react-icons/bs";

const Sidebar = () => {
  // const { user, dispatch } = useAuthContext();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const toggle = () => setIsOpen(!isOpen);

  const handleLogOut = async () => {
    // dispatch({ type: "LOGOUT" });
    // navigate("/sign-in");
    await api.signOut();
  };

  return (
    <Flex
      minH="100vh"
      flex="1"
      bg="bg.surface"
      boxShadow="md"
      maxW={{
        base: "full",
        sm: "xs",
      }}
      py={{
        base: "6",
        sm: "8",
      }}
      px={{
        base: "4",
        sm: "6",
      }}
    >
      <Stack justify="space-between" spacing="1" width="full">
        <Stack shouldWrapChildren>
          <Logo />
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="muted" boxSize="5" />
            </InputLeftElement>
            <Input placeholder="Search" />
          </InputGroup>
          {getSideMenu("Admin")?.map((item, index) => (
            <Menu key={item} {...item} />
          ))}
        </Stack>
        <Divider />
        <Stack
          spacing={{
            base: "5",
            sm: "6",
          }}
        >
          <Stack spacing="1">
            <>
              <NavButton
                color="primary"
                label="Tax Payable"
                onClick={() => navigate(ROUTE_PATH.TAX)}
                icon={BsFillCalculatorFill}
              />
              <NavButton
                color="primary"
                label="Manage Permissions"
                onClick={() => navigate(ROUTE_PATH.PERMISSION)}
                icon={FiPenTool}
              />
              <NavButton
                color="primary"
                label="Configuration"
                onClick={() => navigate(ROUTE_PATH.SETTINGS)}
                icon={FiSettings}
              />
            </>
            <NavButton
              color="primary"
              label="Logout"
              onClick={handleLogOut}
              icon={FiLogOut}
            />
          </Stack>
          <UserProfile />
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Sidebar;
