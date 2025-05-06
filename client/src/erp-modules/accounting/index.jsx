import ComingSoon from "components/ComingSoon";
import PageLayout from "layouts/PageLayout";

const AccountingDashboard = () => {
	return (
		<PageLayout title="AccountingDashboard">
			<ComingSoon
				message={`We are currently working on this module. We will let you know as soon as it's completed.
						Thank you.`}
			/>
		</PageLayout>
	);
};

export default AccountingDashboard;
