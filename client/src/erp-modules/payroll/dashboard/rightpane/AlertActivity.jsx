import { List, ListItem, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

const AlertActivity = ({ tickets, chat, tasks, appointments }) => {
	const TABS = [
		{ name: "Tickets", items: tickets, label: "taskName" },
		{ name: "Messages", items: chat, label: "taskName" },
		{ name: "Tasks", items: tasks, label: "taskName" },
		{ name: "Appointments", items: appointments, label: "taskName" },
	];
	console.log(tasks);
	return (
		<BoxCard mt={3} pb={0}>
			<Tabs variant="enclosed" colorScheme="teal">
				<TabList>
					{TABS?.map(({ name }) => (
						<Tab key={name}>
							<TextTitle size="sm" title={name} />
						</Tab>
					))}
				</TabList>

				<TabPanels>
					{TABS?.map(({ name, items, label, i }) => (
						<TabPanel key={`${name}_${i}`} p={0} height={"285px"} overflowY={"auto"}>
							<List spacing={2}>
								{items?.map((item, i) => (
									<ListItem key={item?._id || i}>
										<BoxCard>
											<NormalTextTitle size="sm" title={item[label]} />
										</BoxCard>
									</ListItem>
								))}
							</List>
						</TabPanel>
					))}
				</TabPanels>
			</Tabs>
		</BoxCard>
	);
};

export default AlertActivity;
