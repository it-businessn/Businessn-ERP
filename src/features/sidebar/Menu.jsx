import { Stack } from "@chakra-ui/react";
import { NavButton } from "components";
import { NavLink } from "react-router-dom";

export default function Menu({ textTransform, color, item }) {
  const { path, name, icon } = item;
  return (
    <NavLink to={path}>
      <Stack>
        <NavButton
          color={color ? color : "primary"}
          label={name}
          icon={icon}
          textTransform={textTransform}
        />
      </Stack>
    </NavLink>
  );
}
