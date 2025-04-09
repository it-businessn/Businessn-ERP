import PageLayout from "layouts/PageLayout";
import OrderGraph from "./orders/OrderGraph";

const Operations = () => {
	return (
		<PageLayout title={"Dashboard"}>
			<OrderGraph />
		</PageLayout>
	);
};

export default Operations;
