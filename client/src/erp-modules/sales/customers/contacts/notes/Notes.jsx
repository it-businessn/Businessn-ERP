import { Box, Card, CardBody, Flex, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
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
				<InputFormControl
					label={"Note description"}
					name="description"
					valueText={newNote.description}
					handleChange={(e) =>
						setNewNote({ ...newNote, description: e.target.value })
					}
					placeholder="Add a new note"
				/>
				<PrimaryButton
					name={"Add Note"}
					size={"sm"}
					mt={4}
					isDisabled={newNote.description === ""}
					onOpen={() => saveNote(newNote)}
				/>
			</form>

			<Box w="100%">
				<VStack spacing={4} w="100%">
					{notes.map((note) => (
						<Card key={note} borderWidth="1px" borderRadius="lg" w="100%">
							<CardBody>
								<Flex justifyContent="space-between">
									<TextTitle
										weight="normal"
										width="80%"
										title={note.description}
									/>
									<TextTitle
										weight="normal"
										size="sm"
										title={moment(note.date).format("MMM DD, YYYY hh:mm A Z")}
										color="gray.500"
										align="end"
									/>
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
