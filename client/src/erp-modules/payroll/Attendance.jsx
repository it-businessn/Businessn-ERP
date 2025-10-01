import ComingSoon from "components/ComingSoon";
import PageLayout from "layouts/PageLayout";

const Attendance = () => {
	return (
		<PageLayout title="Attendance">
			<ComingSoon
				message={`We are currently working on this module to allow you to track and manage attendance.
							We will let you know as soon as it's completed. Thank you.`}
			/>
		</PageLayout>
	);
};

export default Attendance;
