import { ChevronDownIcon, ChevronRightIcon, Icon } from "@chakra-ui/icons";
import {
  Button,
  Collapse,
  Flex,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const MenuItem = ({ menu, textTransform }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <VStack align="stretch" spacing={0}>
      <HStack
        spacing={2}
        cursor="pointer"
        onClick={menu?.children ? handleToggle : undefined}
      >
        {menu?.children && (
          <Icon as={isOpen ? ChevronDownIcon : ChevronRightIcon} />
        )}
        <Flex align="center">
          <IconButton
            variant="ghost"
            icon={menu.icon}
            colorScheme="teal"
            size="xs"
            aria-label="Calendar Icon"
          />
          <NavLink to={menu?.path} activeclassname="active">
            <Button
              variant="ghost"
              color="brand.200"
              fontSize="sm"
              textTransform={textTransform}
            >
              {menu?.name}
            </Button>
          </NavLink>
        </Flex>
      </HStack>
      {menu?.children && (
        <Collapse in={isOpen}>
          <VStack ml={"1.5rem"} align="stretch">
            {menu?.children.map((menu) => (
              <MenuItem key={crypto.randomUUID()} menu={menu} />
            ))}
          </VStack>
        </Collapse>
      )}
    </VStack>
  );
};
export default MenuItem;
