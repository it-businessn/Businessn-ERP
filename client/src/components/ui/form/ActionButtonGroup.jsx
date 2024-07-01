import { HStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import CancelButton from "../button/CancelButton";

const ActionButtonGroup = ({
	submitBtnName,
	isDisabled,
	isLoading,
	onClose,
	closeLabel,
}) => {
	return (
		<HStack justifyContent={!closeLabel && "end"}>
			<PrimaryButton
				isDisabled={isDisabled}
				name={submitBtnName}
				isLoading={isLoading}
				loadingText="Loading"
			/>
			<CancelButton name={closeLabel} onClick={onClose} />
		</HStack>
	);
};

export default ActionButtonGroup;
