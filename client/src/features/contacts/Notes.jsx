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
          <Button onClick={() => saveNote(newNote)} colorScheme="teal">
            Add Note
          </Button>
        </>
      )}
      <Box w="100%">
        <Flex justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Notes
          </Text>
          <Button onClick={() => setShowNoteForm(true)} colorScheme="teal">
            Add New Note
          </Button>
        </Flex>
        <VStack spacing={4} w="100%">
          {notes.map((note, index) => (
            <Card key={index} borderWidth="1px" borderRadius="lg" w="100%">
              <CardBody>
                <Flex justifyContent="space-between">
                  <Text mt={2} fontSize="lg" fontWeight="bold">
                    {note.description}
                  </Text>
                  <Text fontSize="sm" color="gray.500" align="end">
                    {note.date.toLocaleString()}
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
