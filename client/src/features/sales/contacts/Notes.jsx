import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import * as api from "services";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    description: "",
  });

  const [showNoteForm, setShowNoteForm] = useState(true);
  useEffect(() => {
    fetchNotes();
  }, []);

  const saveNote = async (note) => {
    try {
      await api.addNote(note);
      fetchNotes();
      setNewNote({
        description: "",
      });
      setShowNoteForm((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchNotes = async () => {
    try {
      const response = await api.getNotes();
      setNotes(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <VStack spacing="4" p="4">
      {showNoteForm && (
        <>
          <Input
            name="description"
            value={newNote.description}
            onChange={(e) =>
              setNewNote({ ...newNote, description: e.target.value })
            }
            placeholder="Add a new note"
          />
          <Button
            isDisabled={newNote.description === ""}
            onClick={() => saveNote(newNote)}
            colorScheme="teal"
          >
            Add Note
          </Button>
        </>
      )}
      <Box w="100%">
        <Flex justifyContent="flex-end" mb={2}>
          <Button onClick={() => setShowNoteForm(true)} colorScheme="teal">
            Add New Note
          </Button>
        </Flex>
        <VStack spacing={4} w="100%">
          {notes.map((note, index) => (
            <Card key={index} borderWidth="1px" borderRadius="lg" w="100%">
              <CardBody>
                <Flex justifyContent="space-between">
                  <Text>{note.description}</Text>
                  <Text fontSize="sm" color="gray.500" align="end">
                    {moment(note.date).format("MMM DD, YYYY hh:mm A Z")}
                  </Text>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};

export default Notes;
