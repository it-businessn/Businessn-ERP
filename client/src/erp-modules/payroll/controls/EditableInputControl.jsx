import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";

export const EditableInputControl = ({ value = 0, onSave, width = "90px" }) => {
	return (
		<Editable
			defaultValue={String(value)}
			onSubmit={(nextValue) => {
				if (nextValue !== value) {
					onSave(nextValue);
				}
			}}
		>
			<EditablePreview
				width={width}
				cursor="pointer"
				px={2}
				py={1}
				border="1px solid"
				borderColor="var(--filter_border_color)"
				type="number"
				textAlign="center"
				bg={"var(--input_bg)"}
			/>
			<EditableInput
				width={width}
				px={2}
				py={1}
				border="1px solid"
				borderColor="var(--filter_border_color)"
				type="number"
				textAlign="center"
			/>
		</Editable>
	);
};
