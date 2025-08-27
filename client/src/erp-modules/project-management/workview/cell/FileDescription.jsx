import { Editable, EditableInput, EditablePreview, Flex, Tooltip } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";

export const FileDescription = ({ isFile, name, textSize = "sm", width = "100%", onSave }) => (
	<Tooltip label={name} fontSize="xs" hasArrow placement="bottom-start">
		<Flex alignItems={"center"}>
			{isFile ? (
				<NormalTextTitle width={width} size={textSize} title={name} whiteSpace={"nowrap"} />
			) : (
				<Editable
					defaultValue={name}
					onSubmit={(nextValue) => {
						if (nextValue !== name) onSave(nextValue);
					}}
				>
					<EditablePreview
						cursor="pointer"
						width={width}
						size={textSize}
						whiteSpace={"nowrap"}
						padding="0"
					/>
					<EditableInput width={width} />
				</Editable>
			)}
		</Flex>
	</Tooltip>
);
