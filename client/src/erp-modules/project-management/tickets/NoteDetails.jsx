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
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { BASE_URL } from "services";

const NoteDetails = ({ setIsOpen, isOpen, data }) => {
	const handleDownload = (fileName) => {
		const downloadUrl = `${BASE_URL}/ticket/download/${fileName}`;
		window.location.href = downloadUrl;
	};

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
					{data?.originalname && (
						<>
							<FormLabel mt="1em">File</FormLabel>
							<PrimaryButton
								name={data?.originalname}
								onOpen={() => handleDownload(data?.originalname)}
							/>
						</>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default NoteDetails;
