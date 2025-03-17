import {
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Textarea,
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

const NoteDetails = ({ setIsOpen, isOpen, data }) => {
	return (
		<Modal isCentered isOpen={isOpen} size={"xl"} onClose={() => setIsOpen(false)}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalBody py="2em">
					<TextTitle title={`Ticket# ${data?.ticketNumber}`} />
					<FormLabel>Topic</FormLabel>
					<Input type="text" name="name" value={data?.topic || ""} border={"none"} readOnly />
					<FormLabel>Description</FormLabel>
					<Textarea
						value={data?.issue || ""}
						rows={5}
						name="notes"
						readOnly={true}
						placeholder="Log notes..."
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default NoteDetails;
