import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";

const AddResourceForm = ({ onAddResource }) => {
  const [title, setTitle] = useState("");

  const handleAddResource = () => {
    onAddResource({ title });
    setTitle("");
  };

  return (
    <FormControl>
      <FormLabel>Title</FormLabel>
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button mt={4} colorScheme="teal" onClick={handleAddResource}>
        Add Resource
      </Button>
    </FormControl>
  );
};

export default AddResourceForm;
