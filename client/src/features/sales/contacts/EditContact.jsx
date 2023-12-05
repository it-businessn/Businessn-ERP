import {
  Box,
  Button,
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "services";
import EditContactForm from "./EditContactForm";

const EditContact = () => {
  const [contacts, setContacts] = useState([]);
  const [contact, setSelectedContact] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.getContacts();
        setContacts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContacts();
  }, []);
  const [filter, setFilter] = useState("");
  const [edit, setEditForm] = useState(false);
  const filteredContacts = contacts.filter((opp) =>
    opp.companyName.toLowerCase().includes(filter.toLowerCase())
  );
  const navigate = useNavigate();
  const editContact = (opp) => {
    setEditForm(true);
    setSelectedContact(opp);
  };
  const handleSave = async (updatedContact) => {
    try {
      await api.updateContact(updatedContact, updatedContact._id);
      setSelectedContact(null);
      setEditForm((prev) => !prev);
      navigate("/view-contacts");
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleCancel = () => {
    setSelectedContact(null);
    setEditForm((prev) => !prev);
    navigate("/view-contacts");
  };
  return (
    <Box>
      <Stack direction="row" spacing={4} mb={4}>
        <Input
          placeholder="Search Contact..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Stack>
      {!edit &&
        filteredContacts.map((contact) => (
          <Box key={contact.companyName} borderWidth="1px" p={2}>
            <HStack>
              <Text>
                {contact.firstName} {contact.lastName}
              </Text>
              <Text fontWeight="bold">Client: {contact.companyName}</Text>
              <Spacer />
              <Button colorScheme="teal" onClick={() => editContact(contact)}>
                Edit
              </Button>
            </HStack>
          </Box>
        ))}
      {edit && (
        <EditContactForm
          onSave={handleSave}
          onCancel={handleCancel}
          selectedContact={contact}
        />
      )}
    </Box>
  );
};

export default EditContact;
