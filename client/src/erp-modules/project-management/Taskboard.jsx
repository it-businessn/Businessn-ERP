import ComingSoon from "components/ComingSoon";
import PageLayout from "layouts/PageLayout";

const Taskboard = () => {
	return (
		<PageLayout title={"Taskboard"}>
			<ComingSoon
				message={`We are currently working on this module. We will let you know as soon as it's completed.
									Thank you.`}
			/>
		</PageLayout>
	);
};

export default Taskboard;
