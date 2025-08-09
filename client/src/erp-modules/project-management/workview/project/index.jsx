import { Button, Flex, Spacer, useDisclosure } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import FilesOverView from "../files/FilesOverView";
import AddFile from "./AddFile";

const FilesList = ({ files, setRefresh, managers, company }) => {
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
				<AddFile
					managers={managers}
					isOpen={isOpen}
					onClose={onClose}
					setRefresh={setRefresh}
					company={company}
				/>
			)}
			<FilesOverView files={files} managers={managers} company={company} setRefresh={setRefresh} />
		</>
	);
};

export default FilesList;
