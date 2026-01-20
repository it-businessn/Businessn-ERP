import ComingSoon from "components/ComingSoon";
import PageLayout from "layouts/PageLayout";
import { useEffect } from "react";
import VoPayService from "services/VoPayService";

const WebHooks = () => {
	useEffect(() => {
		const getWebHooks = async (id) => {
			try {
				const { data } = await VoPayService.getWebHooks();
			} catch (error) {}
		};
		getWebHooks();
	}, []);
	return (
		<PageLayout title="VOPAY WebHooks">
			<ComingSoon
				message={`We are currently working on this module. We will let you know as soon as it's completed.
					Thank you.`}
			/>
		</PageLayout>
	);
};

export default WebHooks;
