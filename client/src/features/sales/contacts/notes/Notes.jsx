import {
	Box,
	Button,
	Card,
	CardBody,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import NotesService from "services/NotesService";

const Notes = ({ contactId }) => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState({
		description: "",
	});

	useEffect(() => {
		fetchNotesByContactId(contactId);
	}, [contactId]);

	const saveNote = async (note) => {
		try {
			note.contactId = contactId;
			await NotesService.addNote(note);
			fetchNotesByContactId(contactId);
			setNewNote({
				description: "",
			});
		} catch (error) {
			console.error(error);
		}
	};

	const fetchNotesByContactId = async (contactId) => {
		try {
			const response = await NotesService.getNotesByContactId(contactId);
			setNotes(response.data);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<VStack spacing="4" p="4">
			<form className="tab-form">
				<FormControl>
					<FormLabel>Note description</FormLabel>
					<Input
						name="description"
						value={newNote.description}
						onChange={(e) =>
							setNewNote({ ...newNote, description: e.target.value })
						}
						placeholder="Add a new note"
					/>
				</FormControl>
				<Button
					mt={4}
					isDisabled={newNote.description === ""}
					onClick={() => saveNote(newNote)}
					bg="var(--logo_bg)"
				>
					Add Note
				</Button>
			</form>

			<Box w="100%">
				<VStack spacing={4} w="100%">
					{notes.map((note, index) => (
						<Card key={note} borderWidth="1px" borderRadius="lg" w="100%">
							<CardBody>
								<Flex justifyContent="space-between">
									<Text w="80%">{note.description}</Text>
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
