import { Box, Flex, Select } from "@chakra-ui/react";
import HighlightButton from "components/ui/button/HighlightButton";
import CardTitle from "components/ui/card/CardTitle";
import { BAR_DATA } from "constant";
import SelectCustomer from "erp-modules/sales/activities/SelectCustomer";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Bar } from "react-chartjs-2";
import ContactService from "services/ContactService";

const SalesChart = () => {
	const [contacts, setContacts] = useState(null);

	useEffect(() => {
		const fetchAllContacts = async () => {
			try {
				const response = await ContactService.getContacts();
				setContacts(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllContacts();
	}, []);
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
	const [showSelectCustomer, setShowSelectCustomer] = useState(false);
	return (
		<>
			{BAR_DATA.map((bar) => (
				<Box
					key={bar.title}
					color={"brand.nav_color"}
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex
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
					</Flex>
					<Box w={{ base: "70%", md: "65%", lg: "70%", xl: "70%" }} mx={"auto"}>
						<Bar data={bar.data} options={options} />
					</Box>
					<HighlightButton
						name={`Log ${bar.link}`}
						onClick={() => setShowSelectCustomer(true)}
					/>
				</Box>
			))}
			<SelectCustomer
				showSelectCustomer={showSelectCustomer}
				setShowSelectCustomer={setShowSelectCustomer}
				contacts={contacts}
			/>
		</>
	);
};

export default SalesChart;
