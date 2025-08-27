import { Button, Flex, Spacer, useDisclosure } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import AddFile from "../files/AddFile";
import FilesOverView from "../files/FilesOverView";

const FilesList = ({ files, setFiles, managers, company }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Flex>
				<TextTitle title={"Files"} />
				<Spacer />
				<Button
					onClick={onOpen}
					color={"var(--main_color)"}
					bg={"var(--banner_bg)"}
					borderRadius={"8px"}
					size={"sm"}
					px={"2em"}
				>
					Add File
				</Button>
			</Flex>
			{isOpen && (
				<AddFile managers={managers} isOpen={isOpen} onClose={onClose} company={company} />
			)}
			<FilesOverView files={files} setFiles={setFiles} managers={managers} company={company} />
		</>
	);
};

export default FilesList;
