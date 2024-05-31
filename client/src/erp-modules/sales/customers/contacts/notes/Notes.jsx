import { Box, Card, CardBody, Flex, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import { useEffect, useState } from "react";
import NotesService from "services/NotesService";

const Notes = ({ contactId, user }) => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState({
		description: "",
		createdBy: user?._id,
		contactId,
	});

	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		const fetchNotesByContactId = async () => {
			try {
				const response = await NotesService.getNotesByContactId(contactId);
				setNotes(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchNotesByContactId();
	}, [contactId, refresh]);

	const saveNote = async (note) => {
		try {
			await NotesService.addNote(note);
			setRefresh((prev) => !prev);
			setNewNote((prev) => ({
				...prev,
				description: "",
			}));
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
						setNewNote((prev) => ({
							...prev,
							description: e.target.value,
						}))
					}
					placeholder="Add a new note"
				/>
				<PrimaryButton
					name={"Add Note"}
					size={"sm"}
					mt={4}
					isDisabled={newNote.description === ""}
					onOpen={(e) => {
						e.preventDefault();
						saveNote(newNote);
					}}
				/>
			</form>

			<Box w="100%">
				<VStack spacing={4} w="100%">
					{notes?.map(({ _id, description, createdOn }) => (
						<Card key={_id} borderWidth="1px" borderRadius="lg" w="100%">
							<CardBody>
								<Flex justifyContent="space-between">
									<TextTitle weight="normal" width="80%" title={description} />
									<TextTitle
										weight="normal"
										size="sm"
										// title={moment(createdOn).format("MMM DD, YYYY hh:mm A Z")}
										title={moment(createdOn).format("MMM DD, YYYY hh:mm A")}
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
