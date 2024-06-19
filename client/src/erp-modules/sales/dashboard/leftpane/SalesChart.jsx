import { Box } from "@chakra-ui/react";
import HighlightButton from "components/ui/button/HighlightButton";
import CardTitle from "components/ui/card/CardTitle";
import { BAR_DATA, callsMadeBarData, emailsMadeBarData } from "constant";
import SelectCustomer from "erp-modules/sales/activities/SelectCustomer";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Bar } from "react-chartjs-2";
import ActivityService from "services/ActivityService";
import ContactService from "services/ContactService";

const SalesChart = ({ company, selectedUser, user }) => {
	const [contacts, setContacts] = useState(null);
	const [leads, setLeads] = useState(null);
	const [activity, setActivity] = useState(null);
	const [refresh, setRefresh] = useState(null);
	const [showSelectCustomer, setShowSelectCustomer] = useState(false);
	const [logType, setLogType] = useState(null);

	useEffect(() => {
		const fetchAllContacts = async () => {
			try {
				const response = await ContactService.getCompContacts(company);
				response.data.map((_) => (_.stage = _.leadId?.stage));
				const filterContacts = response.data.filter((_) => _.stage === "T4");
				const filterLeads = response.data.filter((_) => _.stage?.includes("L"));
				setContacts(filterContacts);
				setLeads(filterLeads);
			} catch (error) {
				console.error(error);
			}
		};

		const fetchAllUserActivities = async () => {
			try {
				const response = await ActivityService.getActivitiesByUser({
					id: selectedUser?._id,
					company,
					type: "Weekly",
				});

				setActivity(response.data);
				callsMadeBarData.map(
					(item) =>
						(item.call = response.data.filter(
							(_) =>
								_.type === "Call" &&
								moment(_.createdOn).format("ddd") === item.day,
						).length),
				);
				emailsMadeBarData.map(
					(item) =>
						(item.email = response.data.filter(
							(_) =>
								_.type === "Email" &&
								moment(_.createdOn).format("ddd") === item.day,
						).length),
				);

				BAR_DATA[0].data = {
					labels: callsMadeBarData.map((item) => item.day),
					datasets: [
						{
							label: "Calls Made",
							data: callsMadeBarData.map((item) => item.call),
							backgroundColor: "#5580f1",
							borderRadius: 12,
							fill: false,
						},
					],
				};
				BAR_DATA[1].data = {
					labels: emailsMadeBarData.map((item) => item.day),
					datasets: [
						{
							label: "Emails Sent",
							data: emailsMadeBarData.map((item) => item.email),
							backgroundColor: "#61a9c1",
							borderRadius: 12,
							fill: false,
						},
					],
				};
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllUserActivities();
		fetchAllContacts();
	}, [company, refresh, selectedUser]);

	const options = {
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: "rgba(0, 0, 0, 0.1)",
					borderDash: [3, 3],
					drawBorder: false,
				},
				ticks: {
					font: {
						weight: "bold",
						family: "Inter Variable,-apple-system,system-ui,sans-serif",
					},
				},
			},
			x: {
				grid: {
					display: false,
				},
				ticks: {
					font: {
						weight: "bold",
						family: "Inter Variable,-apple-system,system-ui,sans-serif",
					},
					autoSkip: false,
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
		},
		layout: {
			padding: {
				left: 10,
				right: 10,
				top: 0,
				bottom: 0,
			},
		},
	};
	return (
		<>
			{activity &&
				BAR_DATA.map((bar) => (
					<Box
						key={bar.title}
						color={"brand.nav_color"}
						px="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<CardTitle title={bar.title} />
						{/* <Flex
						justify="space-between"
						align="center"
						mb="1"
						color={"brand.nav_color"}
						w={{ base: "auto", md: "103%" }}
					>
						<CardTitle title={bar.title} />
						<Select width="auto" border={"none"} fontSize={"xs"} ml={"1em"}>
							<option>Last Week</option>
							<option>Last Month</option>
						</Select>
					</Flex> */}
						<Box
							w={{ base: "70%", md: "65%", lg: "70%", xl: "70%" }}
							mx={"auto"}
						>
							<Bar data={bar.data} options={options} />
						</Box>
						<HighlightButton
							name={`Log ${bar.link}`}
							onClick={() => {
								setLogType(bar.link.includes("call") ? "Call" : "Email");
								setShowSelectCustomer(true);
							}}
						/>
					</Box>
				))}
			{showSelectCustomer && (
				<SelectCustomer
					logType={logType}
					showSelectCustomer={showSelectCustomer}
					setShowSelectCustomer={setShowSelectCustomer}
					contacts={contacts}
					leads={leads}
					company={company}
					isDashboard
					setRefresh={setRefresh}
					user={user}
				/>
			)}
		</>
	);
};

export default SalesChart;
