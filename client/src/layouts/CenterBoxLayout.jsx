import { Stack } from "@chakra-ui/react";
import PublicLayout from "./PublicLayout";

// UI-01: the small centred card of the public pages (same look as sign-in).
const CenterBoxLayout = ({ spacing = "6", action = "signin", showLogo = true, children }) => (
	<PublicLayout action={action} showLogo={showLogo}>
		<Stack spacing={spacing}>{children}</Stack>
	</PublicLayout>
);

export default CenterBoxLayout;
