import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";

const TasksHistory = () => {
	return (
		<BoxCard p="0.5em">
			<NormalTextTitle size="sm" title="Coming soon" />
			{/* <List spacing={2}>
				<ListItem>
					<BoxCard>
						<NormalTextTitle size="sm" title={"item[label]"} />
					</BoxCard>
				</ListItem>
			</List> */}
		</BoxCard>
	);
};

export default TasksHistory;
