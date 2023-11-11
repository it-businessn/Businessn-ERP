import {
  Button,
  Flex,
  Spacer,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import EditMenu from "features/configuration/EditMenu";

const ConfigurationCard = ({
  title,
  description,
  onOpen,
  content,
  handleChange,
  id,
}) => {
  return (
    <Stack>
      <Flex>
        <Stack spacing="1">
          <Text fontSize="lg" fontWeight="medium">
            {title}
          </Text>
          <Text fontSize="sm" color="muted">
            {description}
          </Text>
        </Stack>
        <Spacer />
        {title !== "Deduction" && (
          <Button variant="primary" onClick={() => onOpen(id, content, title)}>
            <Text>Add {title}</Text>
          </Button>
        )}
      </Flex>
      <StackDivider />
      <Stack spacing="1">
        {content.map(
          (action) =>
            !action?.isSoftDeleted && (
              <EditMenu
                id={id}
                title={title}
                handleChange={handleChange}
                action={action}
                key={title}
              />
            )
        )}
      </Stack>
    </Stack>
  );
};

export default ConfigurationCard;
