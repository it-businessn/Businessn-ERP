import ComingSoon from "components/ComingSoon";
import PageLayout from "layouts/PageLayout";

const HRDashboard = () => {
	return (
		<PageLayout title="Dashboard">
			<ComingSoon
				message={`We are currently working on this module. We will let you know as soon as it's completed.
							Thank you.`}
			/>
		</PageLayout>
	);
};

export default HRDashboard;
