import { IconButton, Stack, Text } from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const EditMenu = ({ action, handleChange, id, title }) => {
  const { name, description } = action;
  return (
    <Stack justify="space-between" direction="row">
      <Stack sx={{ marginTop: "1em" }} fontSize="sm">
        <Text color="emphasized" fontWeight="medium">
          {name}
        </Text>
        <Text color="muted">{description}</Text>
        {action?.deductionAmount && (
          <Text as="b">{action?.deductionAmount}</Text>
        )}

        {action?.role && <Text color="muted">Role: {action?.role}</Text>}
        {action?.totalDays && (
          <Text color="muted">
            Days Available:
            {action?.totalDays}
          </Text>
        )}
      </Stack>

      {!action?.deductionAmount && (
        <Stack
          direction={{
            base: "column",
            sm: "row",
          }}
          spacing={{
            base: "0",
            sm: "1",
          }}
        >
          <IconButton
            isDisabled={action?.isSystemMenu}
            icon={<FiEdit2 fontSize="1.25rem" />}
            variant="ghost"
            aria-label="Edit experience"
            onClick={() => handleChange(action, id, title)}
          />
          <IconButton
            onClick={() => handleChange(action, id, title, true)}
            icon={<FiTrash2 fontSize="1.25rem" />}
            variant="ghost"
            aria-label="Delete experience"
          />
        </Stack>
      )}
    </Stack>
  );
};

export default EditMenu;
