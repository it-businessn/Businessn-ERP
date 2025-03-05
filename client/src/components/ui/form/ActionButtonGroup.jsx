import { HStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import CancelButton from "../button/CancelButton";

const ActionButtonGroup = ({
	submitBtnName,
	isDisabled,
	isLoading,
	onClose,
	closeLabel,
	onOpen,
	size,
	justifyContent,
}) => {
	return (
		<HStack justifyContent={justifyContent ? justifyContent : !closeLabel && "end"}>
			<PrimaryButton
				size={size}
				isDisabled={isDisabled}
				name={submitBtnName}
				isLoading={isLoading}
				loadingText="Loading"
				onOpen={onOpen}
			/>
			<CancelButton name={closeLabel} onClick={onClose} size={size} />
		</HStack>
	);
};

export default ActionButtonGroup;
