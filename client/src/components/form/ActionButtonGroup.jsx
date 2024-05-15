import { Button, HStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";

const ActionButtonGroup = ({ isDisabled, isLoading, onClose }) => {
	return (
		<HStack justifyContent={"end"}>
			<PrimaryButton
				isDisabled={isDisabled}
				name="Add Event"
				isLoading={isLoading}
				loadingText="Loading"
			/>

			<Button onClick={onClose} colorScheme="gray">
				Cancel
			</Button>
		</HStack>
	);
};

export default ActionButtonGroup;
