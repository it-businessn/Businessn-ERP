import { Alert, AlertDescription, AlertIcon, AlertTitle, CloseButton } from "@chakra-ui/react";

const SessionExpiredBanner = ({ onClose }) => (
	<Alert
		status="warning"
		variant="left-accent"
		backgroundColor="yellow.100"
		color="black"
		borderColor="yellow.400"
		borderWidth="1px"
		position="fixed"
		top="0"
		width="100%"
		zIndex="2000"
	>
		<AlertIcon />
		<div>
			<AlertTitle fontSize="lg">Session Expired</AlertTitle>
			<AlertDescription>Please log in again to continue.</AlertDescription>
		</div>
		<CloseButton position="absolute" right="8px" top="8px" onClick={onClose} />
	</Alert>
);

export default SessionExpiredBanner;
